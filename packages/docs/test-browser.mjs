import { chromium, expect } from "@playwright/test"
import axe from "axe-core"
import assert from "node:assert/strict"
import { once } from "node:events"
import {
	mkdir,
	mkdtemp,
	readFile,
	rm,
	symlink,
	writeFile,
} from "node:fs/promises"
import { createServer } from "node:http"
import { tmpdir } from "node:os"
import { dirname, extname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { buildAstroDocs } from "./dist/astro-engine.js"

const temporary = await mkdtemp(join(tmpdir(), "monoline-docs-browser-"))
let browser
let server
try {
	const content = join(temporary, "content")
	await mkdir(join(content, "guide"), { recursive: true })
	await symlink(
		join(
			dirname(dirname(dirname(fileURLToPath(import.meta.url)))),
			"node_modules"
		),
		join(temporary, "node_modules"),
		"dir"
	)
	await writeFile(
		join(temporary, "Counter.jsx"),
		'import { useState } from "react"; export default function Counter() { const [count, setCount] = useState(0); return <button onClick={() => setCount(count + 1)}>Count {count}</button> }'
	)
	await writeFile(
		join(content, "index.mdx"),
		`---\ntitle: Welcome\n---\nimport Counter from "../Counter.jsx"\nimport Tabs from ${JSON.stringify(fileURLToPath(new URL("./dist/components/Tabs.astro", import.meta.url)))}\n\n## Getting started\nRead the [nested guide](./guide/install.md#installation).\n\n<Tabs id="install" labels={["npm", "pnpm"]}><p slot="npm">npm install package</p><p slot="pnpm">pnpm add package</p></Tabs>\n\n<Counter client:load />\n`
	)
	await writeFile(
		join(content, "draft.md"),
		"---\ntitle: Secret draft\ndraft: true\n---\nUnpublished platypus\n"
	)
	await writeFile(
		join(content, "wide.md"),
		"---\ntitle: Wide page\nsidebar: false\ntoc: false\n---\n## Wide content\n"
	)
	await writeFile(
		join(content, "guide/install.md"),
		`---\ntitle: Installation\n---\n## Installation\nFind the unique narwhal instructions here.\n\n> [!NOTE]\n> Keep your configuration safe.\n\n## ${"LongHeading".repeat(30)}\n\n| Name | Value |\n| --- | --- |\n| Wide | ${"TableContent".repeat(40)} |\n\n\`\`\`js\nconst example = "${"CodeContent".repeat(50)}"\n\`\`\`\n`
	)
	const outputs = new Map()
	for (const [base, cleanUrls] of [
		["/", false],
		["/handbook/", false],
		["/ask-widget/", true],
	]) {
		const output = join(temporary, base === "/" ? "root" : base.slice(1, -1))
		await buildAstroDocs({
			title: "Browser fixture",
			contentDirectory: content,
			outDirectory: output,
			base,
			cleanUrls,
			react: true,
			headerLinks: [{ label: "Guide", href: "/guide/install" }],
			footer: {
				text: "Released under MIT.",
				links: [{ label: "Home", href: "/" }],
			},
			editLink: {
				href: "https://github.com/example/docs/edit/main/{path}",
			},
			navigation: [
				{
					label: "Guide",
					items: [
						{ label: "Welcome", href: "/" },
						{ label: "Installation", href: "/guide/install" },
						{ label: "Wide page", href: "/wide" },
					],
				},
			],
		})
		outputs.set(base, { output, cleanUrls })
		assert(
			!(await readFile(join(output, "search-index.json"), "utf8")).includes(
				"platypus"
			)
		)
		const wide = await readFile(
			join(output, cleanUrls ? "wide.html" : "wide/index.html"),
			"utf8"
		)
		assert(!wide.includes('class="sidebar"'))
		assert(wide.includes("<template data-docs-toc"))
	}
	// Serve only generated files: development mode intentionally exposes drafts.
	server = createServer(async (request, response) => {
		try {
			const pathname = decodeURIComponent(
				new URL(request.url, "http://localhost").pathname
			)
			const base =
				[...outputs.keys()]
					.filter((entry) => entry !== "/" && pathname.startsWith(entry))
					.sort((left, right) => right.length - left.length)[0] ?? "/"
			const target = outputs.get(base)
			const relative = pathname.slice(base.length)
			if (
				relative.split("/").some((part) => part === "..") ||
				relative.includes("\\")
			) {
				response.writeHead(400).end()
				return
			}
			const filename =
				relative.endsWith("/") || !relative
					? `${relative}index.html`
					: target.cleanUrls && !extname(relative)
						? `${relative}.html`
						: relative
			let data
			let status = 200
			try {
				data = await readFile(join(target.output, filename))
			} catch (error) {
				if (error.code !== "ENOENT" && error.code !== "EISDIR") throw error
				status = 404
				data = await readFile(join(target.output, "404.html"))
			}
			response
				.writeHead(status, {
					"Content-Type":
						status === 404
							? "text/html"
							: ({
									".html": "text/html",
									".css": "text/css",
									".js": "text/javascript",
									".json": "application/json",
								}[extname(filename)] ?? "application/octet-stream"),
				})
				.end(data)
		} catch {
			response.writeHead(500).end("Fixture server failed")
		}
	})
	server.listen(0, "127.0.0.1")
	await once(server, "listening")
	const origin = `http://127.0.0.1:${server.address().port}`
	browser = await chromium.launch({
		channel: process.env.DOCS_BROWSER_CHANNEL || undefined,
	})
	for (const [base, { cleanUrls }] of outputs) {
		const context = await browser.newContext()
		const page = await context.newPage()
		const errors = []
		page.on("pageerror", (error) => errors.push(error.message))
		await page.goto(origin + base)
		await expect(
			page.getByRole("heading", { name: "Welcome", exact: true })
		).toBeVisible()
		await expect(
			page.getByRole("link", { name: "Guide", exact: true })
		).toHaveAttribute("href", `${base}guide/install${cleanUrls ? "" : "/"}`)
		await expect(
			page
				.getByRole("navigation", { name: "Documentation" })
				.getByRole("link", { name: "Installation", exact: true })
		).toHaveAttribute("href", `${base}guide/install${cleanUrls ? "" : "/"}`)
		await expect(page.getByText("Released under MIT.")).toBeVisible()
		await expect(
			page.getByRole("link", { name: "Edit this page" })
		).toHaveAttribute(
			"href",
			"https://github.com/example/docs/edit/main/index.mdx"
		)
		const pnpmTab = page.getByRole("tab", { name: "pnpm" })
		await pnpmTab.focus()
		await pnpmTab.press("ArrowLeft")
		await expect(
			page.getByRole("tab", { name: "npm", exact: true })
		).toBeFocused()
		await pnpmTab.click()
		await expect(page.getByText("pnpm add package")).toBeVisible()
		await expect(page.getByText("npm install package")).toBeHidden()
		await expect(page.locator(".nav-group")).toHaveAttribute("open", "")
		const counter = page.getByRole("button", { name: "Count 0" })
		await counter.click()
		await expect(page.getByRole("button", { name: "Count 1" })).toBeVisible()
		await page.getByRole("link", { name: "nested guide", exact: true }).click()
		await expect(page).toHaveURL(
			`${origin}${base}guide/install${cleanUrls ? "" : "/"}#installation`
		)
		await expect(
			page.locator('nav[aria-label="Documentation"] [aria-current="page"]')
		).toHaveText("Installation")
		await page.goto(`${origin}${base}guide/install${cleanUrls ? "" : "/"}`)
		await page
			.locator('nav[aria-label="On this page"] a[href="#installation"]')
			.click()
		await expect(page).toHaveURL(/#installation$/)
		await expect(
			page.locator("h2#installation .heading-anchor")
		).toHaveAttribute("href", "#installation")
		await expect(page.locator(".callout")).toContainText(
			"Keep your configuration safe."
		)
		const search = page.getByRole("button", { name: "Search", exact: true })
		await search.click()
		const input = page.getByRole("searchbox")
		await expect(input).toBeFocused()
		await input.fill("narwhal")
		await expect(page.locator(".search-results a")).toHaveCount(1)
		await input.press("ArrowDown")
		await expect(page.locator(".search-results a")).toBeFocused()
		await page.keyboard.press("Enter")
		await expect(page.getByRole("dialog")).not.toBeVisible()
		await search.click()
		await input.fill("no-such-unicorn-987")
		await expect(
			page.getByRole("status").filter({ hasText: "No results" })
		).toBeVisible()
		await input.press("Escape")
		await expect(page.getByRole("dialog")).not.toBeVisible()
		await expect(search).toBeFocused()
		for (const theme of ["light", "dark", "system"]) {
			await page
				.getByRole("combobox", { name: "Color theme" })
				.selectOption(theme)
			await page.reload()
			await expect(page.locator("html")).toHaveAttribute("data-theme", theme)
			await expect(
				page.getByRole("combobox", { name: "Color theme" })
			).toHaveValue(theme)
			if (theme === "system") {
				await page.emulateMedia({ colorScheme: "light" })
				const light = await page
					.locator("body")
					.evaluate((body) => getComputedStyle(body).backgroundColor)
				await page.emulateMedia({ colorScheme: "dark" })
				await expect
					.poll(() =>
						page
							.locator("body")
							.evaluate((body) => getComputedStyle(body).backgroundColor)
					)
					.not.toBe(light)
			}
			await page.addScriptTag({ content: axe.source })
			assert.deepEqual(
				await page.evaluate(async () =>
					(await window.axe.run()).violations.map(({ id, nodes }) => ({
						id,
						targets: nodes.map((node) => node.target),
					}))
				),
				[],
				`${base} ${theme}: accessibility violations`
			)
		}
		await page.setViewportSize({ width: 375, height: 812 })
		await expect
			.poll(() =>
				page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
			)
			.toBe(true)
		await expect(page.locator("table")).toBeVisible()
		for (const selector of ["pre"]) {
			assert(
				await page
					.locator(selector)
					.evaluate((element) => element.scrollWidth > element.clientWidth),
				`${selector} fixture must exercise overflow`
			)
		}
		await page.addScriptTag({ content: axe.source })
		assert.deepEqual(
			await page.evaluate(async () =>
				(await window.axe.run()).violations.map(({ id }) => id)
			),
			[],
			`${base} mobile accessibility`
		)
		for (const route of cleanUrls
			? ["missing", "draft"]
			: ["missing/", "draft/"]) {
			assert.equal((await page.goto(origin + base + route)).status(), 404)
			await expect(
				page.getByRole("heading", { name: "Page not found" })
			).toBeVisible()
		}
		assert.deepEqual(errors, [], `${base} browser errors`)
		await context.close()
		const noJS = await browser.newContext({
			javaScriptEnabled: false,
			viewport: { width: 375, height: 812 },
		})
		const plain = await noJS.newPage()
		await plain.goto(origin + base)
		await expect(plain.getByRole("tab")).toHaveCount(0)
		await expect(plain.locator(".docs-tab-list")).not.toBeVisible()
		await expect(plain.getByText("npm install package")).toBeVisible()
		await expect(plain.getByText("pnpm add package")).toBeVisible()
		await expect(
			plain.getByRole("button", { name: "Search", exact: true })
		).not.toBeVisible()
		await plain.getByRole("link", { name: "nested guide", exact: true }).click()
		await expect(plain.locator("article")).toContainText("narwhal")
		await expect(plain.locator("pre")).toBeVisible()
		await noJS.close()
		console.log(
			`PASS ${base}: production routes, navigation, search, themes, no-JS, mobile, axe`
		)
	}
} finally {
	await browser?.close()
	if (server)
		await new Promise((resolve, reject) =>
			server.close((error) => (error ? reject(error) : resolve()))
		)
	await rm(temporary, { recursive: true, force: true })
}
