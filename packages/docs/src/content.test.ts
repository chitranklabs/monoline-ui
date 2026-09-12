// @vitest-environment node
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"

import { discoverPages } from "./content"

const temporaryDirectories: string[] = []

async function contentDirectory(): Promise<string> {
	const directory = await mkdtemp(join(tmpdir(), "monoline-docs-"))
	temporaryDirectories.push(directory)
	return directory
}

afterEach(async () => {
	await Promise.all(
		temporaryDirectories
			.splice(0)
			.map((directory) => rm(directory, { force: true, recursive: true }))
	)
})

describe("discoverPages", () => {
	it("maps Markdown files to sorted documentation routes", async () => {
		const directory = await contentDirectory()
		await mkdir(join(directory, "guides", "advanced"), { recursive: true })
		await Promise.all([
			writeFile(join(directory, "index.md"), "# Home"),
			writeFile(join(directory, "guides", "install.mdx"), "# Install"),
			writeFile(
				join(directory, "guides", "advanced", "index.md"),
				"# Advanced"
			),
			writeFile(join(directory, "ignored.txt"), "Ignored"),
		])

		await expect(discoverPages(directory)).resolves.toEqual([
			{ filePath: join(directory, "index.md"), route: "/" },
			{
				filePath: join(directory, "guides", "advanced", "index.md"),
				route: "/guides/advanced",
			},
			{
				filePath: join(directory, "guides", "install.mdx"),
				route: "/guides/install",
			},
		])
	})

	it("rejects files that resolve to the same route", async () => {
		const directory = await contentDirectory()
		await mkdir(join(directory, "guides"))
		await Promise.all([
			writeFile(join(directory, "guides.md"), "# Guides"),
			writeFile(join(directory, "guides", "index.md"), "# Guides"),
		])

		await expect(discoverPages(directory)).rejects.toThrow(
			'Duplicate documentation route "/guides"'
		)
	})
})
