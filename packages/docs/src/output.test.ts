// @vitest-environment node
import {
	mkdir,
	mkdtemp,
	readFile,
	readdir,
	realpath,
	rm,
	writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, expect, it, vi } from "vitest"

import { publishFiles } from "./output"

const failure = vi.hoisted(() => ({
	mountOutput: "",
	target: "",
	armed: false,
	rollback: false,
	pauseTarget: "",
	entered: undefined as (() => void) | undefined,
	release: undefined as Promise<void> | undefined,
}))
vi.mock("node:fs/promises", async (importOriginal) => {
	const actual = await importOriginal<typeof import("node:fs/promises")>()
	const fail = (target: unknown) => {
		if (failure.armed && target === failure.target) {
			failure.armed = false
			throw new Error("Injected promotion failure")
		}
	}
	return {
		...actual,
		rm: (...args: Parameters<typeof actual.rm>) => {
			fail(args[0])
			return actual.rm(...args)
		},
		writeFile: (...args: Parameters<typeof actual.writeFile>) => {
			fail(args[0])
			return actual.writeFile(...args)
		},
		rename: async (...args: Parameters<typeof actual.rename>) => {
			if (
				failure.mountOutput &&
				String(args[1]).startsWith(failure.mountOutput + "/") &&
				!String(args[0]).startsWith(failure.mountOutput + "/")
			)
				throw Object.assign(new Error("Cross-device rename"), { code: "EXDEV" })
			if (failure.rollback && String(args[0]).includes("/old-"))
				throw new Error("Injected rollback failure")
			if (args[1] === failure.pauseTarget) {
				failure.pauseTarget = ""
				failure.entered?.()
				await failure.release
			}
			fail(args[1])
			return actual.rename(...args)
		},
		unlink: (...args: Parameters<typeof actual.unlink>) => {
			fail(args[0])
			return actual.unlink(...args)
		},
	}
})

const roots: string[] = []
afterEach(async () => {
	vi.restoreAllMocks()
	failure.armed = false
	failure.mountOutput = ""
	failure.rollback = false
	failure.pauseTarget = ""
	await Promise.all(
		roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))
	)
})

it("stages on the output filesystem when the output root is a mount point", async () => {
	const root = await realpath(
		await mkdtemp(join(tmpdir(), "docs-output-mount-"))
	)
	roots.push(root)
	const output = join(root, "dist")
	await mkdir(output)
	failure.mountOutput = output
	await publishFiles(output, new Map([["a.html", "old"]]))
	await publishFiles(output, new Map([["a.html", "new"]]))
	expect(await readFile(join(output, "a.html"), "utf8")).toBe("new")
})

it("reports cleanup failure as a warning after committing a successful site", async () => {
	const root = await realpath(
		await mkdtemp(join(tmpdir(), "docs-output-cleanup-"))
	)
	roots.push(root)
	const output = join(root, "dist")
	await publishFiles(output, new Map([["a.html", "old"]]))
	const warning = vi.spyOn(process, "emitWarning").mockImplementation(() => {})
	failure.target = join(output, ".monoline-promotion")
	failure.armed = true
	await expect(
		publishFiles(output, new Map([["a.html", "new"]]))
	).resolves.toBeUndefined()
	expect(await readFile(join(output, "a.html"), "utf8")).toBe("new")
	expect(warning).toHaveBeenCalled()
	await expect(
		publishFiles(output, new Map([["a.html", "retry"]]))
	).rejects.toThrow("locked")
})

it.each(["b.html", "stale.html", ".monoline-generated.json"])(
	"restores prior bytes and manifest after promotion fails at %s, then rebuilds",
	async (name) => {
		const root = await realpath(
			await mkdtemp(join(tmpdir(), "docs-output-recovery-"))
		)
		roots.push(root)
		const output = join(root, "dist")
		const prior = new Map([
			["a.html", "old-a"],
			["b.html", "old-b"],
			["stale.html", "old-stale"],
		])
		await publishFiles(output, prior)
		await writeFile(join(output, "keep.txt"), "unrelated")
		const manifest = await readFile(join(output, ".monoline-generated.json"))
		failure.target = join(output, name)
		failure.armed = true
		const next = new Map([
			["a.html", "new-a"],
			["nested/new.html", "new-page"],
			["b.html", "new-b"],
		])
		await expect(publishFiles(output, next)).rejects.toThrow(
			"Injected promotion failure"
		)
		for (const [path, value] of prior)
			expect(await readFile(join(output, path), "utf8")).toBe(value)
		expect(await readFile(join(output, ".monoline-generated.json"))).toEqual(
			manifest
		)
		expect(await readFile(join(output, "keep.txt"), "utf8")).toBe("unrelated")
		await expect(
			readFile(join(output, "nested/new.html"))
		).rejects.toMatchObject({ code: "ENOENT" })
		expect(await readdir(root)).toEqual(["dist"])
		await publishFiles(output, next)
		expect(await readFile(join(output, "a.html"), "utf8")).toBe("new-a")
		await expect(readFile(join(output, "stale.html"))).rejects.toMatchObject({
			code: "ENOENT",
		})
	}
)

it("rejects a concurrent promotion without removing the active writer's lock", async () => {
	const root = await realpath(
		await mkdtemp(join(tmpdir(), "docs-output-lock-"))
	)
	roots.push(root)
	const output = join(root, "dist")
	await publishFiles(output, new Map([["a.html", "old"]]))
	failure.pauseTarget = join(output, "a.html")
	const entered = new Promise<void>((resolve) => {
		failure.entered = resolve
	})
	let release!: () => void
	failure.release = new Promise<void>((resolve) => {
		release = resolve
	})
	const first = publishFiles(output, new Map([["a.html", "first"]]))
	try {
		await entered
		await expect(
			publishFiles(output, new Map([["a.html", "second"]]))
		).rejects.toThrow("locked")
		expect(await readFile(join(output, "a.html"), "utf8")).toBe("old")
	} finally {
		release()
		await first
	}
	expect(await readFile(join(output, "a.html"), "utf8")).toBe("first")
	expect(await readdir(root)).toEqual(["dist"])
})

it("retains recovery bytes and blocks retries if rollback also fails", async () => {
	const root = await realpath(
		await mkdtemp(join(tmpdir(), "docs-output-retained-"))
	)
	roots.push(root)
	const output = join(root, "dist")
	await publishFiles(
		output,
		new Map([
			["a.html", "old-a"],
			["b.html", "old-b"],
		])
	)
	failure.target = join(output, "b.html")
	failure.armed = true
	failure.rollback = true
	await expect(
		publishFiles(
			output,
			new Map([
				["a.html", "new-a"],
				["b.html", "new-b"],
			])
		)
	).rejects.toThrow("Recovery files retained")
	const lock = join(output, ".monoline-promotion")
	const recovery = JSON.parse(
		await readFile(join(lock, "recovery.json"), "utf8")
	) as { files: Array<{ name: string; backup: string }> }
	const backup = recovery.files.find((file) => file.name === "a.html")!
	expect(await readFile(backup.backup, "utf8")).toBe("old-a")
	await expect(
		publishFiles(output, new Map([["a.html", "retry"]]))
	).rejects.toThrow("locked")
	expect(await readFile(backup.backup, "utf8")).toBe("old-a")
})

it.each([true, false])(
	"preserves the initial destination (exists: %s) when the first manifest commit fails",
	async (exists) => {
		const root = await realpath(
			await mkdtemp(join(tmpdir(), "docs-output-first-"))
		)
		roots.push(root)
		const output = join(root, "dist")
		if (exists) await mkdir(output)
		failure.target = join(output, ".monoline-generated.json")
		failure.armed = true
		await expect(
			publishFiles(output, new Map([["nested/a.html", "new"]]))
		).rejects.toThrow("Injected promotion failure")
		if (exists) expect(await readdir(output)).toEqual([])
		else await expect(readdir(output)).rejects.toMatchObject({ code: "ENOENT" })
		expect(await readdir(root)).toEqual(exists ? ["dist"] : [])
	}
)

it("leaves output untouched if preparing replacement bytes fails", async () => {
	const root = await realpath(
		await mkdtemp(join(tmpdir(), "docs-output-stage-"))
	)
	roots.push(root)
	const output = join(root, "dist")
	await publishFiles(
		output,
		new Map([
			["a.html", "old-a"],
			["b.html", "old-b"],
		])
	)
	const manifest = await readFile(join(output, ".monoline-generated.json"))
	failure.target = join(output, ".monoline-promotion", "new-1")
	failure.armed = true
	await expect(
		publishFiles(
			output,
			new Map([
				["a.html", "new-a"],
				["b.html", "new-b"],
			])
		)
	).rejects.toThrow("Injected promotion failure")
	expect(await readFile(join(output, "a.html"), "utf8")).toBe("old-a")
	expect(await readFile(join(output, "b.html"), "utf8")).toBe("old-b")
	expect(await readFile(join(output, ".monoline-generated.json"))).toEqual(
		manifest
	)
	expect(await readdir(root)).toEqual(["dist"])
})
