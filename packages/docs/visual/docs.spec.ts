import { expect, test } from "@playwright/test"
import { once } from "node:events"
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { type Server, createServer } from "node:http"
import { tmpdir } from "node:os"
import { extname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { buildAstroDocs } from "../dist/astro-engine.js"

let root: string
let server: Server
let origin: string

test.beforeAll(async () => {
	root = await mkdtemp(join(tmpdir(), "monoline-docs-visual-"))
	const content = join(root, "content")
	const output = join(root, "dist")
	await mkdir(content)
	const source = (
		await readFile(
			new URL("../fixtures/browser/visual.mdx", import.meta.url),
			"utf8"
		)
	).replace(
		/^import (\w+) from "@chitrank2050\/monoline-docs\/components\/([^"]+)"/gm,
		(_, component, name) =>
			`import ${component} from ${JSON.stringify(fileURLToPath(new URL(`../dist/components/${name}`, import.meta.url)))}`
	)
	await writeFile(join(content, "index.mdx"), source)
	await buildAstroDocs({
		title: "Monoline Docs",
		contentDirectory: content,
		outDirectory: output,
		footer: { text: "Released under the MIT License." },
	})
	server = createServer(async (request, response) => {
		try {
			const path = decodeURIComponent(
				new URL(request.url!, "http://localhost").pathname
			)
			if (path.split("/").includes("..") || path.includes("\\")) {
				response.writeHead(400).end()
				return
			}
			const file = path.endsWith("/") ? `${path}index.html` : path
			const data = await readFile(join(output, file))
			response
				.writeHead(200, {
					"Content-Type":
						(
							{
								".html": "text/html",
								".js": "text/javascript",
								".css": "text/css",
								".json": "application/json",
							} as Record<string, string>
						)[extname(file)] ?? "application/octet-stream",
				})
				.end(data)
		} catch (error) {
			response
				.writeHead(
					(error as NodeJS.ErrnoException).code === "ENOENT" ? 404 : 500
				)
				.end()
		}
	})
	server.listen(0, "127.0.0.1")
	await once(server, "listening")
	origin = `http://127.0.0.1:${(server.address() as { port: number }).port}`
})

test.afterAll(async () => {
	if (server)
		await new Promise<void>((resolve, reject) =>
			server.close((error) => (error ? reject(error) : resolve()))
		)
	if (root) await rm(root, { recursive: true, force: true })
})

for (const theme of ["light", "dark"]) {
	for (const width of [375, 1440]) {
		test(`${theme} ${width}px documentation layouts`, async ({ page }) => {
			await page.setViewportSize({ width, height: 1000 })
			await page.addInitScript(
				(theme) => localStorage.setItem("monoline-docs-theme", theme),
				theme
			)
			await page.goto(origin)
			await expect(page.locator("html")).toHaveAttribute("data-theme", theme)
			await expect(
				page
					.locator(".docs-code-block")
					.first()
					.locator('[data-highlight="true"]')
			).toHaveCount(1)
			await expect(page.locator(".docs-preview-code").first()).toContainText(
				"@chitrank2050/monoline-docs/components/Badge.astro"
			)
			await page.evaluate(() => document.fonts.ready)
			await page.mouse.move(0, 0)
			const name = (component: string) => `${component}-${theme}-${width}.png`
			await expect(page).toHaveScreenshot(name("shell"))
			await expect(page.locator(".docs-code-block").first()).toHaveScreenshot(
				name("codeblock")
			)
			await expect(page.locator(".docs-table-scroll").first()).toHaveScreenshot(
				name("table")
			)
			await expect(page.locator(".docs-preview").first()).toHaveScreenshot(
				name("preview-short")
			)
			const preview = page.locator(".docs-preview").nth(1)
			await expect(preview).toHaveScreenshot(name("preview-collapsed"))
			await preview.locator("details.docs-example-source > summary").click()
			await expect(preview).toHaveScreenshot(name("preview-expanded"))
			await page.getByRole("button", { name: "Search", exact: true }).click()
			await page.getByRole("searchbox").fill("configuration")
			await expect(page.getByRole("dialog")).toBeVisible()
			await expect(page.getByRole("dialog")).toHaveScreenshot(name("search"))
		})
	}
}
