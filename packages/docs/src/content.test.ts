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
			writeFile(join(directory, "index.md"), "---\ntitle: Home\n---\n# Home"),
			writeFile(
				join(directory, "guides", "install.mdx"),
				"---\ntitle: Install\ndescription: Install Monoline Docs.\norder: 1\n---\n# Install"
			),
			writeFile(
				join(directory, "guides", "advanced", "index.md"),
				"---\ntitle: Advanced\n---\n# Advanced"
			),
			writeFile(join(directory, "ignored.txt"), "Ignored"),
		])

		await expect(discoverPages(directory)).resolves.toEqual([
			{
				filePath: join(directory, "index.md"),
				metadata: { title: "Home" },
				route: "/",
			},
			{
				filePath: join(directory, "guides", "advanced", "index.md"),
				metadata: { title: "Advanced" },
				route: "/guides/advanced",
			},
			{
				filePath: join(directory, "guides", "install.mdx"),
				metadata: {
					description: "Install Monoline Docs.",
					order: 1,
					title: "Install",
				},
				route: "/guides/install",
			},
		])
	})

	it("rejects files that resolve to the same route", async () => {
		const directory = await contentDirectory()
		await mkdir(join(directory, "guides"))
		await Promise.all([
			writeFile(join(directory, "guides.md"), "---\ntitle: Guides\n---"),
			writeFile(
				join(directory, "guides", "index.md"),
				"---\ntitle: Guides\n---"
			),
		])

		await expect(discoverPages(directory)).rejects.toThrow(
			'Duplicate documentation route "/guides"'
		)
	})

	it("rejects missing or invalid metadata with the source path", async () => {
		const directory = await contentDirectory()
		const filePath = join(directory, "invalid.md")
		await writeFile(filePath, "---\ntitle: 42\n---\n# Invalid")

		await expect(discoverPages(directory)).rejects.toThrow(
			`Invalid documentation metadata in "${filePath}": title must be a non-empty string`
		)
	})

	it("excludes drafts only from production discovery", async () => {
		const directory = await contentDirectory()
		await writeFile(
			join(directory, "draft.md"),
			"---\ntitle: Draft\ndraft: true\n---\n# Draft"
		)

		await expect(
			discoverPages(directory, { environment: "development" })
		).resolves.toHaveLength(1)
		await expect(
			discoverPages(directory, { environment: "production" })
		).resolves.toEqual([])
	})
})
