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
import { loadConfig } from "./dist/index.js"

async function setTheme(page, theme) {
	if (theme === "system") {
		// System remains a supported configured default, not a selectable toggle state.
		await page.evaluate(() =>
			localStorage.setItem("monoline-docs-theme", "system")
		)
		await page.reload()
		return
	}
	const current = await page.locator("html").getAttribute("data-theme")
	const dark =
		current === "dark" ||
		(current === "system" &&
			(await page.evaluate(
				() => matchMedia("(prefers-color-scheme: dark)").matches
			)))
	if ((theme === "dark") !== dark) await page.locator(".theme-control").click()
	else if (current === "system") {
		await page.locator(".theme-control").click()
		await page.locator(".theme-control").click()
	}
}

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
		`---\ntitle: Welcome\ndescription: Documentation for the example package.\n---\nimport Counter from "../Counter.jsx"\nimport Tabs from ${JSON.stringify(fileURLToPath(new URL("./dist/components/Tabs.astro", import.meta.url)))}\n\n## Getting started\nRead the [nested guide](./guide/source.md#installation).\n\n<Tabs id="install" labels={["npm", "pnpm"]}><p slot="npm">npm install package</p><p slot="pnpm">pnpm add package</p></Tabs>\n\n<Counter client:load />\n`
	)
	await writeFile(
		join(content, "draft.md"),
		"---\ntitle: Secret draft\ndraft: true\n---\nUnpublished platypus\n"
	)
	await writeFile(
		join(content, "wide.md"),
		`---\ntitle: ${"LongReferenceTitle".repeat(8)}\nnavTitle: Wide page\nsidebar: false\ntoc: false\nlayout: reference\n---\n## Wide content\n`
	)
	await writeFile(
		join(content, "guide/source.md"),
		`---\ntitle: Installation\nslug: guide/install\nupdatedAt: 2026-10-01\n---\n## Installation\nFind the unique narwhal instructions here.\n\n${"A long section keeps the current heading active between anchors. ".repeat(150)}\n\n> [!NOTE]\n> Keep your configuration safe.\n\n## ${"LongHeading".repeat(30)}\n\n| Name | Value |\n| --- | --- |\n| Wide | ${"TableContent".repeat(40)} |\n\n\`\`\`js\nconst example = "${"CodeContent".repeat(50)}"\n\`\`\`\n`
	)
	await writeFile(
		join(content, "api.md"),
		"---\ntitle: API reference\n---\n## Methods\nRead the [installation guide](/guide/install#installation).\n"
	)
	let componentSource = await readFile(
		new URL("./fixtures/browser/components.mdx", import.meta.url),
		"utf8"
	)
	componentSource = componentSource
		.replace(
			/from "@chitrank2050\/monoline-docs\/components\/([^"]+)"/g,
			(_, name) =>
				`from ${JSON.stringify(fileURLToPath(new URL(`./dist/components/${name}`, import.meta.url)))}`
		)
		.replaceAll('href="/deployment"', 'href="/guide/install"')
		.replaceAll('href="/configuration"', 'href="/guide/install"')
		.replace(
			"import Table",
			'import Counter from "../Counter.jsx"\nimport Table'
		)
	componentSource +=
		'\n## Interactive preview\n\n<Preview title="Interactive counter" mode="interactive"><Counter client:load /></Preview>\n'
	await writeFile(join(content, "components.mdx"), componentSource)
	const assets = join(temporary, "assets")
	await mkdir(assets)
	await writeFile(
		join(assets, "icon.svg"),
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 14V2l6 8 6-8v12" fill="none" stroke="currentColor"/></svg>'
	)
	await writeFile(
		join(assets, "build-flow.svg"),
		await readFile(
			new URL("../../apps/docs-demo/assets/build-flow.svg", import.meta.url)
		)
	)
	const outputs = new Map()
	const specFile = join(temporary, "openapi.json")
	await writeFile(
		specFile,
		JSON.stringify({
			openapi: "3.1.0",
			info: { title: "Pets API", version: "1" },
			paths: {
				"/pets/{id}": {
					get: {
						operationId: "getPet",
						tags: ["Pets"],
						summary: "Retrieve a pet",
						parameters: [
							{
								name: "id",
								in: "path",
								required: true,
								schema: { type: "string" },
							},
						],
						security: [{ token: [] }],
						responses: {
							200: {
								description: "The pet",
								content: {
									"application/json": {
										schema: { $ref: "#/components/schemas/Pet" },
										example: { id: "one" },
									},
								},
							},
						},
					},
				},
			},
			components: {
				securitySchemes: { token: { type: "http", scheme: "bearer" } },
				schemas: {
					Pet: {
						type: "object",
						properties: {
							id: { type: "string" },
							parent: { $ref: "#/components/schemas/Pet" },
						},
					},
				},
			},
		})
	)
	for (const [base, cleanUrls] of [
		["/", false],
		["/handbook/", false],
		["/ask-widget/", true],
	]) {
		const output = join(temporary, base === "/" ? "root" : base.slice(1, -1))
		await buildAstroDocs({
			title:
				base === "/ask-widget/"
					? "Documentation for the Example SDK and its complete API reference"
					: "Browser fixture",
			contentDirectory: content,
			outDirectory: output,
			base,
			cleanUrls,
			openapi: { file: specFile, route: "/reference" },
			react: true,
			assetsDirectory: assets,
			branding: { favicon: "/assets/icon.svg" },
			appearance: {
				density: base === "/handbook/" ? "compact" : "comfortable",
				radius: 0.375,
				accent: { light: "#753c22", dark: "#e9b894" },
				fonts: { body: { family: "Arial" }, code: { family: "Courier New" } },
			},
			header: {
				primaryAction: { label: "Get started", href: "/guide/install" },
				announcement: {
					text: "SDK 1.0 is available. Read the installation guide.",
					href: "/guide/install",
				},
			},
			content: {
				showLastUpdated: base !== "/handbook/",
				copyPageLink: base !== "/handbook/",
			},
			headerLinks: [{ label: "Guide", href: "/guide/install" }],
			footer: {
				text: "Released under MIT.",
				links: [{ label: "Home", href: "/" }],
			},
			editLink: {
				href: "https://github.com/example/docs/edit/main/{path}",
			},
			navigation: {
				sections: [
					{
						label: "Guides",
						href: "/",
						icon: "◇",
						items: [
							{
								label: "Guide",
								expanded: true,
								items: [
									{ label: "Welcome", href: "/", order: 1 },
									{ label: "Installation", href: "/guide/install", order: 2 },
									{ label: "Wide page", href: "/wide", order: 3 },
									{
										label: "Components",
										style: "plain",
										order: 4,
										items: [
											{ label: "Authoring components", href: "/components" },
										],
									},
								],
							},
						],
					},
					{
						label: "API",
						href: "/api",
						badge: "Beta",
						items: [
							{
								label: "Reference",
								expanded: true,
								items: [
									{ label: "API reference", href: "/api" },
									{ label: "Pets API", href: "/reference" },
									{
										label: "Retrieve a pet",
										href: "/reference/operations/getpet",
									},
									{ label: "Pet schema", href: "/reference/schemas/pet" },
								],
							},
						],
					},
				],
			},
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
		const html = await readFile(
			join(
				output,
				cleanUrls ? "guide/install.html" : "guide/install/index.html"
			),
			"utf8"
		)
		assert.equal(
			html.includes('<time datetime="2026-10-01"'),
			base !== "/handbook/"
		)
		assert.equal(
			/class="[^"]*\bcopy-page-link\b[^"]*"/.test(html),
			base !== "/handbook/"
		)
		assert(html.includes(`rel="icon" href="${base}assets/icon.svg"`))
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
									".svg": "image/svg+xml",
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
		await context.addInitScript(() => {
			window.docsLayoutShift = 0
			new PerformanceObserver((list) => {
				for (const entry of list.getEntries())
					if (!entry.hadRecentInput) window.docsLayoutShift += entry.value
			}).observe({ type: "layout-shift", buffered: true })
		})
		const page = await context.newPage()
		const errors = []
		page.on("pageerror", (error) => errors.push(error.message))
		await page.goto(origin + base)
		let searchRequests = 0
		page.on("request", (request) => {
			if (request.url().endsWith("search-index.json")) searchRequests++
			assert(
				new URL(request.url()).origin === origin,
				`unexpected remote request: ${request.url()}`
			)
		})
		assert.equal(searchRequests, 0, "search should load only on request")
		await expect(page.locator("html")).toHaveAttribute(
			"data-density",
			base === "/handbook/" ? "compact" : "comfortable"
		)
		await expect(
			page.getByRole("link", { name: "Get started", exact: true })
		).toHaveAttribute("href", `${base}guide/install${cleanUrls ? "" : "/"}`)
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
		await expect(page.locator("details.nav-group")).toHaveAttribute("open", "")
		await expect(page.locator(".nav-group-plain")).toHaveAttribute(
			"role",
			"group"
		)
		await expect(
			page.locator(".nav-group-plain details, .nav-group-plain summary")
		).toHaveCount(0)
		await expect(page.locator(".nav-group-plain a")).toHaveAttribute(
			"href",
			`${base}components${cleanUrls ? "" : "/"}`
		)
		const counter = page.getByRole("button", { name: "Count 0" })
		await counter.click()
		await expect(page.getByRole("button", { name: "Count 1" })).toBeVisible()
		const layoutShift = await page.evaluate(() => window.docsLayoutShift)
		assert(
			layoutShift < 0.01,
			`${base} initial CLS must stay below 0.01; got ${layoutShift}`
		)
		console.log(`${base} initial CLS: ${layoutShift}`)
		await page.getByRole("link", { name: "nested guide", exact: true }).click()
		await expect(page).toHaveURL(
			`${origin}${base}guide/install${cleanUrls ? "" : "/"}#installation`
		)
		await expect(
			page.locator('nav[aria-label="Documentation"] [aria-current="page"]')
		).toHaveText("Installation")
		await expect(
			page.locator('.section-links [aria-current="true"]')
		).toContainText("Guides")
		await expect(page.locator(".pager a").last()).toHaveAttribute(
			"href",
			`${base}wide${cleanUrls ? "" : "/"}`
		)
		await expect
			.poll(() =>
				page
					.locator("h2#installation")
					.evaluate(
						(heading) =>
							heading.getBoundingClientRect().top -
							document.querySelector(".site-header").getBoundingClientRect()
								.bottom
					)
			)
			.toBeGreaterThanOrEqual(0)
		await page.goto(`${origin}${base}guide/install${cleanUrls ? "" : "/"}`)
		await expect
			.poll(() =>
				page
					.locator(".sidebar")
					.evaluate((element) =>
						Math.abs(
							element.getBoundingClientRect().top -
								document.querySelector(".site-header").getBoundingClientRect()
									.bottom
						)
					)
			)
			.toBeLessThan(2)
		await page.evaluate(() =>
			scrollTo(0, document.getElementById("installation").offsetTop + 400)
		)
		await expect(
			page.locator('.toc [aria-current="location"]')
		).toHaveAttribute("href", "#installation")
		await page.evaluate(() => scrollTo(0, 0))
		await expect(page.locator("time")).toHaveCount(
			base === "/handbook/" ? 0 : 1
		)
		await expect(page.locator(".copy-page-link")).toHaveCount(
			base === "/handbook/" ? 0 : 1
		)
		await page.evaluate(() => {
			Object.defineProperty(navigator, "clipboard", {
				configurable: true,
				value: {
					writeText: async (text) => {
						window.copiedMarkdown = text
					},
				},
			})
		})
		await page.locator(".copy-markdown").click()
		await expect
			.poll(() => page.evaluate(() => window.copiedMarkdown))
			.toContain("narwhal instructions")

		await page
			.locator('nav[aria-label="On this page"] a[href="#installation"]')
			.click()
		await expect(page).toHaveURL(/#installation$/)
		assert(
			await page
				.locator("h2#installation")
				.evaluate(
					(heading) =>
						heading.getBoundingClientRect().top >=
						document.querySelector(".site-header").getBoundingClientRect()
							.bottom -
							2
				),
			"heading anchor must clear the sticky header"
		)
		await expect(
			page.locator("h2#installation .heading-anchor")
		).toHaveAttribute("href", "#installation")
		await expect(page.locator(".callout")).toContainText(
			"Keep your configuration safe."
		)
		const search = page.getByRole("button", { name: "Search", exact: true })
		await page.keyboard.press("Control+k")
		const input = page.getByRole("searchbox")
		await expect(input).toBeFocused()
		const searchTree = await page.getByRole("dialog").ariaSnapshot()
		assert(searchTree.includes('dialog "Search documentation"'))
		assert(searchTree.includes('searchbox "Search pages and headings"'))
		assert(searchTree.includes('group "Search scope"'))
		await page.keyboard.press("Control+k")
		await expect(input).toBeFocused()
		await input.fill("narwhal")
		await expect(page.locator(".search-results a")).toHaveCount(1)
		await page.getByRole("button", { name: "API", exact: true }).click()
		await expect(page.locator(".search-results a")).toHaveCount(0)
		await page.getByRole("button", { name: "Guides", exact: true }).click()
		await expect(page.locator(".search-results a")).toHaveCount(1)
		if (process.env.DOCS_SCREENSHOT_DIR && base === "/")
			await page.screenshot({
				path: join(process.env.DOCS_SCREENSHOT_DIR, "search-guides.png"),
			})
		await page.getByRole("button", { name: "All", exact: true }).click()
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
		assert.equal(
			searchRequests,
			1,
			"reopening search must reuse its loaded index"
		)
		await setTheme(page, "light")
		await page.goto(`${origin}${base}guide/install${cleanUrls ? "" : "/"}`)
		await setTheme(page, "dark")
		await page.goBack()
		await expect(page.locator(".theme-control")).toHaveAttribute(
			"aria-label",
			`Switch to ${(await page.locator("html").getAttribute("data-theme")) === "dark" ? "light" : "dark"} theme`
		)
		for (const theme of ["light", "dark", "system"]) {
			await setTheme(page, theme)
			await page.reload()
			await expect(page.locator("html")).toHaveAttribute("data-theme", theme)
			await expect(page.locator(".theme-control")).toHaveAttribute(
				"aria-label",
				/Switch to (light|dark) theme/
			)
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
			await search.click()
			await input.fill("narwhal")
			await expect(page.locator(".search-results p mark")).toHaveCount(1)
			await page.waitForFunction(() =>
				document
					.getAnimations()
					.every((animation) => animation.playState !== "running")
			)
			await page.addScriptTag({ content: axe.source })
			assert.deepEqual(
				await page.evaluate(async () =>
					(
						await window.axe.run(document.querySelector(".search-dialog"))
					).violations.map(({ id }) => id)
				),
				[],
				`${base} ${theme}: open-search accessibility`
			)
			await input.press("Escape")
			await page.waitForFunction(() =>
				document
					.getAnimations()
					.every((animation) => animation.playState !== "running")
			)
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
		const prose = await page.evaluate(() => {
			const probe = document.createElement("div")
			probe.innerHTML =
				'<h2>Prose probe</h2><div class="not-typeset" style="font-size:19px"><h2>Class opt-out</h2></div><div data-not-typeset style="font-size:19px"><div><h2>Attribute opt-out</h2></div></div><h2 class="prose-author-probe">Author override</h2>'
			const style = document.createElement("style")
			style.textContent = ".prose-author-probe { font-size:23px; }"
			document.head.append(style)
			document.querySelector("article").append(probe)
			const result = [...probe.querySelectorAll("h2")].map((heading) => {
				const computed = getComputedStyle(heading)
				return { size: computed.fontSize, weight: computed.fontWeight }
			})
			probe.remove()
			style.remove()
			return result
		})
		assert.deepEqual(
			prose,
			[
				{ size: "24px", weight: "600" },
				{ size: "28.5px", weight: "700" },
				{ size: "28.5px", weight: "700" },
				{ size: "23px", weight: "600" },
			],
			`${base}: prose opt-outs and author CSS must retain their typography`
		)
		const tableOptOut = await page.evaluate(() => {
			const probe = document.createElement("div")
			probe.innerHTML =
				'<div class="not-typeset"><table><tbody><tr><td>A</td><td>B</td></tr></tbody></table></div><div data-not-typeset><table><tbody><tr><td>C</td><td>D</td></tr></tbody></table></div>'
			document.querySelector("article").append(probe)
			const result = [...probe.querySelectorAll("td")].map(
				(cell) => getComputedStyle(cell).minWidth
			)
			probe.remove()
			return result
		})
		assert.equal(tableOptOut.length, 4)
		assert(
			tableOptOut.every((width) => width === "auto" || width === "0px"),
			`${base}: opted-out tables must retain intrinsic cell widths`
		)

		for (const width of [320, 768, 1280, 1920]) {
			await page.setViewportSize({ width, height: 900 })
			const geometry = await page.evaluate(() => {
				const bounds = (selector) => {
					const { left, right } = document
						.querySelector(selector)
						.getBoundingClientRect()
					return { left, right }
				}
				return {
					article: bounds("article"),
					content: [".page-header", ".page-actions", ".pager"]
						.filter((selector) => document.querySelector(selector))
						.map(bounds),
					separators: [".section-bar", "body > footer"].map(bounds),
					viewport: document.documentElement.clientWidth,
				}
			})
			for (const bounds of geometry.content) {
				assert(Math.abs(bounds.left - geometry.article.left) < 1)
				assert(
					Math.abs(bounds.right - geometry.article.right) < 1,
					`${base} ${width}: article and page navigation must share edges: ${JSON.stringify(geometry)}`
				)
			}
			for (const bounds of geometry.separators) {
				assert(Math.abs(bounds.left) < 1)
				assert(
					Math.abs(bounds.right - geometry.viewport) < 1,
					`${base} ${width}: shell separators must span the viewport`
				)
			}
		}
		await page.setViewportSize({ width: 375, height: 812 })
		await page.evaluate(() => {
			navigator.clipboard.writeText = () =>
				new Promise((resolve, reject) => {
					window.finishCopy = resolve
					window.failCopy = reject
				})
		})
		await page.locator(".copy-markdown").click()
		await expect(page.locator(".copy-markdown-status")).toHaveText("Copying…")
		await expect(page.locator(".copy-markdown")).toHaveAttribute(
			"aria-busy",
			"true"
		)
		await expect
			.poll(() => page.evaluate(() => typeof window.finishCopy))
			.toBe("function")
		await page.evaluate(() => window.failCopy(new Error("Clipboard denied")))
		await expect(page.locator(".copy-markdown-status")).toHaveText(
			"Copy failed. Try again."
		)
		await expect(page.locator(".copy-markdown")).toBeEnabled()
		await page.evaluate(() => {
			window.finishCopy = undefined
		})
		await page.locator(".copy-markdown").click()
		await expect(page.locator(".copy-markdown-status")).toHaveText("Copying…")
		await expect
			.poll(() => page.evaluate(() => typeof window.finishCopy))
			.toBe("function")
		await page.evaluate(() => window.finishCopy())
		await expect(page.locator(".copy-markdown-status")).toHaveText(
			"Markdown copied"
		)
		const copyFeedback = await page.evaluate(() => {
			const status = document
				.querySelector(".copy-markdown-status")
				.getBoundingClientRect()
			const description = document
				.querySelector(".description")
				?.getBoundingClientRect()
			return {
				left: status.left,
				right: status.right,
				bottom: status.bottom,
				descriptionTop: description?.top,
				width: innerWidth,
			}
		})
		assert(
			copyFeedback.left >= 0 && copyFeedback.right <= copyFeedback.width,
			"mobile copy feedback must fit the viewport"
		)
		if (copyFeedback.descriptionTop !== undefined)
			assert(
				copyFeedback.bottom <= copyFeedback.descriptionTop,
				"mobile copy feedback must not overlap the description"
			)
		const toggle = page.getByRole("button", { name: "Open navigation" })
		for (const theme of ["light", "dark"]) {
			await setTheme(page, theme)
			for (const width of [320, 375]) {
				await page.setViewportSize({ width, height: 812 })
				const layout = await page.evaluate(() => ({
					header: document.querySelector(".site-header").getBoundingClientRect()
						.height,
					overflow: document.documentElement.scrollWidth > innerWidth,
					controls: [
						".nav-toggle",
						".search-trigger",
						".theme-control",
						".copy-markdown",
						".copy-page-link",
						".copy-code",
					]
						.filter((selector) => document.querySelector(selector))
						.map((selector) => {
							const rect = document
								.querySelector(selector)
								.getBoundingClientRect()
							return { selector, width: rect.width, height: rect.height }
						}),
				}))
				assert(
					layout.header <= 160,
					`${base} ${theme} ${width}: header ${layout.header}px exceeds reading budget`
				)
				assert.equal(layout.overflow, false)
				for (const control of layout.controls)
					assert(
						control.width >= 44 && control.height >= 44,
						`${control.selector} must have a 44px touch target`
					)
			}
		}
		await page.setViewportSize({ width: 375, height: 812 })
		const mobileContents = page.locator(".mobile-toc")
		await mobileContents.locator("summary").click()
		const contentsLink = mobileContents.getByRole("link").first()
		const contentsHref = await contentsLink.getAttribute("href")
		await contentsLink.click()
		await expect(mobileContents).not.toHaveAttribute("open", "")
		assert.equal(new URL(page.url()).hash, contentsHref)
		const enlargedText = await page.addStyleTag({
			content:
				"html { font-size: 200% } * { letter-spacing: .12em !important; word-spacing: .16em !important; line-height: 1.5 !important } p { margin-bottom: 2em !important }",
		})
		await expect
			.poll(() =>
				page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
			)
			.toBe(true)
		await expect(toggle).toBeVisible()
		await enlargedText.evaluate((element) => element.remove())
		await toggle.click()
		const drawer = page.getByRole("dialog", {
			name: "Documentation navigation",
		})
		await expect(drawer).toBeVisible()
		const drawerAction = drawer.getByRole("link", {
			name: "Get started",
			exact: true,
		})
		await drawerAction.hover()
		assert(
			await drawerAction.evaluate((element) => {
				const style = getComputedStyle(element)
				return style.color !== style.backgroundColor
			}),
			"Hovered mobile primary action must retain contrasting text"
		)
		await expect(
			drawer.getByRole("link", { name: "Get started", exact: true })
		).toBeVisible()
		await expect(
			drawer.getByRole("navigation", { name: "Site links" })
		).toBeVisible()
		await expect(
			page.getByRole("button", { name: "Close navigation", exact: true })
		).toBeFocused()
		for (let step = 0; step < 8; step++) {
			await page.keyboard.press("Tab")
			// Native dialogs may tab to browser chrome, but never background content.
			assert(
				await drawer.evaluate(
					(element) =>
						!document.hasFocus() || element.contains(document.activeElement)
				),
				"drawer must exclude background keyboard focus"
			)
		}
		await page.locator(".brand").evaluate((element) => element.focus())
		assert(
			await drawer.evaluate(
				(element) =>
					!document.hasFocus() || element.contains(document.activeElement)
			),
			"background must be inert"
		)
		await page
			.getByRole("button", { name: "Close navigation", exact: true })
			.focus()
		await page.keyboard.press("Escape")
		await expect(drawer).not.toBeVisible()
		await expect(toggle).toBeFocused()
		await toggle.click()
		await page.keyboard.press("Control+k")
		await expect(drawer).not.toBeVisible()
		await expect(input).toBeFocused()
		await input.press("Escape")
		await toggle.click()
		await page.setViewportSize({ width: 1440, height: 1000 })
		await expect(drawer).not.toBeVisible()
		await expect(toggle).toBeHidden()
		await expect(page.locator(".layout > .sidebar")).toBeVisible()
		await page.setViewportSize({ width: 375, height: 812 })
		await toggle.click()
		await page.mouse.click(350, 400)
		await expect(drawer).not.toBeVisible()
		await expect(toggle).toBeFocused()
		await page.emulateMedia({ reducedMotion: "reduce" })
		for (const selector of [".nav-dialog", ".search-dialog"]) {
			assert.equal(
				await page
					.locator(selector)
					.evaluate((element) => getComputedStyle(element).transitionDuration),
				"0s"
			)
		}
		assert.equal(
			await page
				.locator(".sidebar")
				.evaluate((element) => getComputedStyle(element).transitionDuration),
			"0s"
		)
		await page.emulateMedia({ media: "print" })
		await expect(page.locator(".site-header")).toBeHidden()
		await expect(page.locator("article")).toBeVisible()
		await page.emulateMedia({ media: "screen" })
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
		await page.waitForFunction(() =>
			document
				.getAnimations()
				.every((animation) => animation.playState !== "running")
		)
		await page.addScriptTag({ content: axe.source })
		assert.deepEqual(
			await page.evaluate(async () =>
				(await window.axe.run()).violations.map(({ id }) => id)
			),
			[],
			`${base} mobile accessibility`
		)
		await page.emulateMedia({ forcedColors: "active" })
		assert.deepEqual(
			await page.evaluate(async () =>
				(await window.axe.run()).violations.map(({ id }) => id)
			),
			[],
			`${base} forced-colors accessibility`
		)
		await page.emulateMedia({ forcedColors: "none" })
		if (process.env.DOCS_SCREENSHOT_DIR) {
			await mkdir(process.env.DOCS_SCREENSHOT_DIR, { recursive: true })
			await page.evaluate(() => scrollTo(0, 0))
			for (const theme of ["light", "dark"]) {
				await setTheme(page, theme)
				for (const width of [375, 1440]) {
					await page.setViewportSize({ width, height: 1000 })
					await page.screenshot({
						path: join(
							process.env.DOCS_SCREENSHOT_DIR,
							`${base.replaceAll("/", "") || "root"}-${theme}-${width}.png`
						),
						fullPage: false,
					})
				}
			}
		}
		await page.goto(`${origin}${base}api${cleanUrls ? "" : "/"}`)
		await expect(
			page.locator('.section-links [aria-current="true"]')
		).toContainText("API")
		await expect(page.locator(".sidebar")).toContainText("API reference")
		await expect(page.locator(".sidebar")).not.toContainText("Installation")
		await expect(page.locator(".pager a")).toHaveCount(1)
		await expect(page.locator(".pager a")).toHaveAttribute(
			"href",
			`${base}reference${cleanUrls ? "" : "/"}`
		)
		// Keep a real overflowing sidebar across a full document navigation.
		await page.setViewportSize({ width: 1440, height: 240 })
		await page.goto(`${origin}${base}guide/install${cleanUrls ? "" : "/"}`)
		await expect
			.poll(() =>
				page.evaluate(() =>
					Math.abs(
						parseFloat(
							getComputedStyle(document.documentElement).getPropertyValue(
								"--header-offset"
							)
						) -
							document.querySelector(".site-header").getBoundingClientRect()
								.height
					)
				)
			)
			.toBeLessThan(1)
		const sidebarScroll = await page.locator(".sidebar").evaluate((element) => {
			element.scrollTop = 100000
			return element.scrollTop
		})
		assert(sidebarScroll > 0, "fixture sidebar must overflow")
		await page.goto(origin + base)
		await expect
			.poll(() =>
				page
					.locator(".sidebar")
					.evaluate(
						(element, expected) =>
							Math.abs(
								element.scrollTop -
									Math.min(
										expected,
										element.scrollHeight - element.clientHeight
									)
							),
						sidebarScroll
					)
			)
			.toBeLessThanOrEqual(2)
		await page.setViewportSize({ width: 1440, height: 900 })
		await page.goto(`${origin}${base}wide${cleanUrls ? "" : "/"}`)
		assert(
			await page.evaluate(
				() => document.documentElement.scrollWidth <= innerWidth
			),
			"long reference title must not overflow"
		)
		assert.equal(
			await page
				.locator("main")
				.evaluate((element) =>
					getComputedStyle(element).getPropertyValue("--content-width")
				),
			"60rem"
		)
		for (const route of cleanUrls
			? ["missing", "draft"]
			: ["missing/", "draft/"]) {
			assert.equal((await page.goto(origin + base + route)).status(), 404)
			await expect(
				page.getByRole("heading", { name: "Page not found" })
			).toBeVisible()
		}
		await page.goto(`${origin}${base}components${cleanUrls ? "" : "/"}`)
		const groups = page.locator(".docs-code-group")
		await expect(groups).toHaveCount(3)
		const initialGroupHeight = await groups
			.nth(1)
			.evaluate((element) => element.getBoundingClientRect().height)
		const firstPnpm = groups
			.first()
			.getByRole("tab", { name: "pnpm", exact: true })
		await firstPnpm.focus()
		await firstPnpm.press("Enter")
		await expect(
			groups.nth(1).getByRole("tab", { name: "pnpm", exact: true })
		).toHaveAttribute("aria-selected", "true")
		await expect(firstPnpm).toBeFocused()
		await expect(
			groups.nth(2).getByRole("tab", { name: "npm", exact: true })
		).toHaveAttribute("aria-selected", "true")
		await expect(
			page
				.locator(".docs-tabs:not([data-sync])")
				.getByRole("tab", { name: "npm", exact: true })
		).toHaveAttribute("aria-selected", "true")
		await firstPnpm.press("ArrowRight")
		await expect(
			groups.first().getByRole("tab", { name: "yarn", exact: true })
		).toBeFocused()
		await expect(
			groups.nth(1).getByRole("tab", { name: "yarn", exact: true })
		).toHaveAttribute("aria-selected", "true")
		await groups
			.first()
			.getByRole("tab", { name: "yarn", exact: true })
			.press("End")
		await expect(
			groups.nth(2).getByRole("tab", { name: "bun", exact: true })
		).toHaveAttribute("aria-selected", "true")
		assert.equal(
			await groups
				.nth(1)
				.evaluate((element) => element.getBoundingClientRect().height),
			initialGroupHeight,
			"synchronization must preserve panel height"
		)
		for (const width of [375, 1440]) {
			await page.setViewportSize({ width, height: 1000 })
			await page.reload()
			await expect(page).toHaveURL(
				`${origin}${base}components${cleanUrls ? "" : "/"}`
			)
			await expect(
				groups.first().getByRole("tab", { name: "bun", exact: true })
			).toHaveAttribute("aria-selected", "true")
			await page.evaluate(async () => {
				await document.fonts.ready
				await new Promise((resolve) =>
					requestAnimationFrame(() => requestAnimationFrame(resolve))
				)
			})
			const componentShift = await page.evaluate(() => window.docsLayoutShift)
			assert(
				componentShift < 0.01,
				`${base} ${width}px saved manager component CLS must stay below 0.01; got ${componentShift}`
			)
			console.log(
				`${base} ${width}px saved manager component CLS: ${componentShift}`
			)
		}
		await expect(
			groups.first().getByRole("tab", { name: "bun", exact: true })
		).toHaveAttribute("aria-selected", "true")
		await expect(
			groups.nth(1).getByRole("tab", { name: "bun", exact: true })
		).toHaveAttribute("aria-selected", "true")
		await groups
			.first()
			.getByRole("tab", { name: "bun", exact: true })
			.press("Home")
		await expect(
			groups.first().getByRole("tab", { name: "npm", exact: true })
		).toBeFocused()
		await expect(
			groups.nth(2).getByRole("tab", { name: "npm", exact: true })
		).toHaveAttribute("aria-selected", "true")
		const accordion = page.locator(".docs-accordion")
		await accordion.locator("summary").focus()
		await accordion.locator("summary").press("Enter")
		await expect(
			accordion.getByText(
				"Yes. Markdown pages do not need to import any components."
			)
		).toBeVisible()
		await accordion.locator("summary").press("Space")
		await expect(accordion).not.toHaveAttribute("open")
		const folder = page
			.locator(".docs-file-tree summary")
			.filter({ hasText: /^guide$/ })
		await folder.focus()
		await folder.press("Enter")
		await expect(
			page
				.locator(".docs-file-tree")
				.first()
				.getByText("install.md", { exact: true })
		).toBeVisible()
		await expect(page.locator(".docs-figure img")).toHaveAttribute(
			"src",
			`${base}assets/build-flow.svg`
		)
		await expect(page.locator(".docs-figure img")).toHaveAttribute(
			"width",
			"360"
		)
		await expect(page.locator(".docs-figure img")).toHaveAttribute(
			"height",
			"288"
		)
		await page.locator(".docs-figure img").scrollIntoViewIfNeeded()
		await expect
			.poll(() =>
				page
					.locator(".docs-figure img")
					.evaluate((image) => image.complete && image.naturalWidth > 0)
			)
			.toBe(true)

		const previewRegion = page.locator(".docs-preview-example").first()
		await expect(previewRegion).toHaveAttribute("tabindex", "0")
		await previewRegion.focus()
		await expect(previewRegion).toBeFocused()
		await page
			.locator(".docs-preview")
			.last()
			.getByRole("button", { name: "Count 0" })
			.click()
		await expect(
			page
				.locator(".docs-preview")
				.last()
				.getByRole("button", { name: "Count 1" })
		).toBeVisible()
		for (const theme of ["light", "dark"]) {
			await setTheme(page, theme)
			const componentAxe = await page.evaluate(async (source) => {
				;(0, eval)(source)
				return axe.run(document, {
					runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
				})
			}, axe.source)
			assert.deepEqual(
				componentAxe.violations.map((issue) => issue.id),
				[],
				`${base} ${theme} component accessibility`
			)
			for (const width of [375, 1440]) {
				await page.setViewportSize({ width, height: 1000 })
				for (const selector of [
					".docs-code-group .copy-code:visible",
					"article > .code-block .copy-code:visible",
				]) {
					const copy = page.locator(selector).first()
					await copy.scrollIntoViewIfNeeded()
					await page.mouse.move(0, 0)
					const resting = await copy.evaluate(
						(button) => getComputedStyle(button).backgroundColor
					)
					await copy.hover()
					await expect
						.poll(() =>
							copy.evaluate(
								(button) => getComputedStyle(button).backgroundColor
							)
						)
						.not.toBe(resting)
					const centerError = await copy.evaluate((button) => {
						const icon = getComputedStyle(button, "::before")
						return Math.abs(
							parseFloat(getComputedStyle(button).borderTopWidth) +
								parseFloat(icon.top) +
								parseFloat(icon.marginTop) +
								parseFloat(icon.height) / 2 -
								button.getBoundingClientRect().height / 2
						)
					})
					assert(centerError < 1, "copy icon must be vertically centered")
				}
				assert(
					await page.evaluate(
						() => document.documentElement.scrollWidth <= innerWidth
					),
					"components must not overflow"
				)
				await page.emulateMedia({ forcedColors: "active" })
				assert.deepEqual(
					await page.evaluate(async () =>
						(await window.axe.run()).violations.map(({ id }) => id)
					),
					[],
					`${base} forced-colors accessibility`
				)
				await page.emulateMedia({ forcedColors: "none" })
				if (process.env.DOCS_SCREENSHOT_DIR) {
					await page
						.locator("#synchronized-code-groups")
						.scrollIntoViewIfNeeded()
					await page.screenshot({
						path: join(
							process.env.DOCS_SCREENSHOT_DIR,
							`components-${base === "/" ? "root" : base.slice(1, -1)}-${theme}-${width}.png`
						),
					})
					await page.locator("#cards-and-grids").scrollIntoViewIfNeeded()
					await page.screenshot({
						path: join(
							process.env.DOCS_SCREENSHOT_DIR,
							`cards-${base === "/" ? "root" : base.slice(1, -1)}-${theme}-${width}.png`
						),
					})
					await page.locator("#figures-and-previews").scrollIntoViewIfNeeded()
					await page.screenshot({
						path: join(
							process.env.DOCS_SCREENSHOT_DIR,
							`figures-${base === "/" ? "root" : base.slice(1, -1)}-${theme}-${width}.png`
						),
					})
					await page.locator("#library-reference").scrollIntoViewIfNeeded()
					await page.screenshot({
						path: join(
							process.env.DOCS_SCREENSHOT_DIR,
							`library-${base === "/" ? "root" : base.slice(1, -1)}-${theme}-${width}.png`
						),
					})
				}
			}
		}
		await page.emulateMedia({ media: "print" })
		await expect(
			groups.first().getByText("bun add example-sdk", { exact: true })
		).toBeVisible()
		await expect(
			groups.first().getByText("npm install example-sdk", { exact: true })
		).toBeVisible()
		await page.emulateMedia({ media: "screen" })
		assert.deepEqual(errors, [], `${base} browser errors`)
		const mobilePage = await context.newPage()
		await mobilePage.setViewportSize({ width: 375, height: 812 })
		await mobilePage.goto(origin + base)
		await expect(
			mobilePage.getByRole("button", { name: "Open navigation" })
		).toBeVisible()
		await mobilePage.evaluate(async () => {
			await document.fonts.ready
			await new Promise((resolve) =>
				requestAnimationFrame(() => requestAnimationFrame(resolve))
			)
		})
		const mobileShift = await mobilePage.evaluate(() => window.docsLayoutShift)
		assert(
			mobileShift < 0.01,
			`${base} initial mobile CLS must stay below 0.01; got ${mobileShift}`
		)
		console.log(`${base} initial mobile CLS: ${mobileShift}`)
		await mobilePage.setViewportSize({ width: 375, height: 140 })
		await mobilePage.getByRole("button", { name: "Open navigation" }).click()
		const drawerScroll = await mobilePage
			.locator(".nav-dialog")
			.evaluate((element) => {
				element.scrollTop = 30
				return element.scrollTop
			})
		assert(drawerScroll > 0, "mobile drawer must overflow")
		await mobilePage.keyboard.press("Escape")
		await expect(mobilePage.locator(".nav-dialog")).not.toBeVisible()
		await mobilePage.goto(
			`${origin}${base}guide/install${cleanUrls ? "" : "/"}`
		)
		await mobilePage.getByRole("button", { name: "Open navigation" }).click()
		await expect
			.poll(() =>
				mobilePage
					.locator(".nav-dialog")
					.evaluate(
						(element, expected) => Math.abs(element.scrollTop - expected),
						drawerScroll
					)
			)
			.toBeLessThanOrEqual(2)

		for (const theme of ["light", "dark"]) {
			for (const width of [375, 1440]) {
				await page.setViewportSize({ width, height: 1000 })
				await page.goto(
					`${origin}${base}reference/operations/getpet${cleanUrls ? "" : "/"}`
				)
				await setTheme(page, theme)
				await expect(
					page.getByRole("heading", { name: "Retrieve a pet", level: 1 })
				).toBeVisible()
				await expect(page.locator("main pre").last()).toContainText("<TOKEN>")
				await page.evaluate(() => {
					Object.defineProperty(navigator, "clipboard", {
						configurable: true,
						value: {
							writeText: async (text) => {
								window.copiedRequest = text
							},
						},
					})
				})
				await page.locator("main .copy-code").last().click()
				await expect(page.locator("main .copy-code").last()).toHaveAttribute(
					"data-copied",
					""
				)
				await expect
					.poll(() => page.evaluate(() => window.copiedRequest))
					.toContain("Bearer <TOKEN>")
				assert(
					await page.evaluate(
						() => document.documentElement.scrollWidth <= innerWidth
					),
					"API reference must not overflow"
				)
				const result = await page.evaluate(async (source) => {
					;(0, eval)(source)
					return axe.run(document, {
						runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
					})
				}, axe.source)
				assert.deepEqual(
					result.violations.map((issue) => issue.id),
					[]
				)
				if (process.env.DOCS_SCREENSHOT_DIR)
					await page.screenshot({
						path: join(
							process.env.DOCS_SCREENSHOT_DIR,
							`api-${base === "/" ? "root" : base.slice(1, -1)}-${theme}-${width}.png`
						),
					})
			}
		}
		await context.close()
		const noJS = await browser.newContext({
			javaScriptEnabled: false,
			viewport: { width: 375, height: 812 },
		})
		const plain = await noJS.newPage()
		await plain.goto(
			`${origin}${base}reference/operations/getpet${cleanUrls ? "" : "/"}`
		)
		await expect(plain.locator("main pre").last()).toContainText("<TOKEN>")
		await expect(
			plain.getByRole("heading", { name: /^Responses/, level: 2 })
		).toBeVisible()
		await plain
			.locator("main")
			.getByRole("link", { name: "Pet", exact: true })
			.click()
		await expect(
			plain.getByRole("heading", { name: "Pet", level: 1 })
		).toBeVisible()
		await plain.goto(origin + base)
		await plain.locator(".mobile-toc summary").click()
		await expect(plain.locator(".mobile-toc nav")).toBeVisible()
		const plainContents = plain.locator(".mobile-toc a").first()
		const plainHref = await plainContents.getAttribute("href")
		await plainContents.click()
		assert.equal(new URL(plain.url()).hash, plainHref)
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
		await plain.getByRole("link", { name: "API Beta", exact: true }).click()
		await expect(
			plain.getByRole("heading", { name: "API reference", exact: true })
		).toBeVisible()
		await expect(
			plain.locator('.section-links [aria-current="true"]')
		).toContainText("API")
		await plain.goto(`${origin}${base}components${cleanUrls ? "" : "/"}`)
		await expect(plain.getByRole("tab")).toHaveCount(0)
		await expect(
			plain.getByText("npm install example-sdk", { exact: true })
		).toBeVisible()
		await expect(
			plain.getByText("pnpm add example-sdk", { exact: true })
		).toBeVisible()
		await expect(
			plain.getByText("bun add example-sdk", { exact: true })
		).toBeVisible()
		await plain.locator(".docs-accordion summary").focus()
		await plain.locator(".docs-accordion summary").press("Enter")
		await expect(plain.locator(".docs-accordion")).toHaveAttribute("open", "")
		await expect(
			plain
				.locator(".docs-preview")
				.last()
				.getByRole("button", { name: "Count 0" })
		).toBeVisible()
		await noJS.close()
		const blockedStorage = await browser.newContext()
		await blockedStorage.addInitScript(() => {
			for (const storage of ["sessionStorage", "localStorage"])
				Object.defineProperty(window, storage, {
					get() {
						throw new Error("Storage disabled")
					},
				})
		})
		const fallback = await blockedStorage.newPage()
		const fallbackErrors = []
		fallback.on("pageerror", (error) => fallbackErrors.push(error.message))
		await fallback.goto(origin + base)
		await fallback
			.getByRole("link", { name: "nested guide", exact: true })
			.click()
		await expect(
			fallback.getByRole("heading", { name: "Installation", exact: true })
		).toBeVisible()
		await fallback.goto(`${origin}${base}components${cleanUrls ? "" : "/"}`)
		await fallback
			.locator(".docs-code-group")
			.first()
			.getByRole("tab", { name: "pnpm", exact: true })
			.click()
		await expect(
			fallback
				.locator(".docs-code-group")
				.nth(1)
				.getByRole("tab", { name: "pnpm", exact: true })
		).toHaveAttribute("aria-selected", "true")
		assert.deepEqual(fallbackErrors, [])
		await blockedStorage.close()
		console.log(
			`PASS ${base}: production routes, navigation, search, themes, no-JS, mobile, axe`
		)
	}
	if (process.env.DOCS_ASK_WIDGET_DIRECTORY) {
		const fixture = process.env.DOCS_ASK_WIDGET_DIRECTORY
		outputs.set("/", { output: join(fixture, "dist-root"), cleanUrls: true })
		outputs.set("/ask-widget/", {
			output: join(fixture, "dist"),
			cleanUrls: true,
		})
		for (const base of ["/", "/ask-widget/"]) {
			const context = await browser.newContext()
			const page = await context.newPage()
			const errors = []
			page.on("pageerror", (error) => errors.push(error.message))
			await page.goto(`${origin}${base}getting-started`)
			await expect(
				page.getByRole("button", { name: "Open Ask Widget example" })
			).toBeVisible()
			for (const theme of ["light", "dark"]) {
				await setTheme(page, theme)
				await expect(page.locator(".chat-widget")).toHaveAttribute(
					"data-theme",
					theme
				)
				for (const width of [375, 1440]) {
					await page.setViewportSize({ width, height: 1000 })
					await page
						.getByRole("button", { name: "Open Ask Widget example" })
						.click()
					await page
						.getByRole("textbox", { name: "Message input" })
						.fill(`Streaming ${theme} ${width}`)
					await page.getByRole("button", { name: "Send message" }).click()
					await expect(
						page.getByText(
							`Local example: Streaming ${theme} ${width}. No request was sent.`,
							{ exact: true }
						)
					).toBeVisible()
					await expect(page.locator(".chat-widget__panel")).toHaveCSS(
						"opacity",
						"1"
					)
					assert(
						await page.evaluate(
							() => document.documentElement.scrollWidth <= innerWidth
						)
					)
					if (process.env.DOCS_SCREENSHOT_DIR)
						await page.screenshot({
							animations: "disabled",
							path: join(
								process.env.DOCS_SCREENSHOT_DIR,
								`widget-${base === "/" ? "root" : "subpath"}-${theme}-${width}.png`
							),
						})
					await page.getByRole("button", { name: "Close panel" }).click()
				}
			}
			assert.deepEqual(errors, [])
			await context.close()
			const noJS = await browser.newContext({ javaScriptEnabled: false })
			const plain = await noJS.newPage()
			await plain.goto(`${origin}${base}getting-started`)
			await expect(
				plain.getByRole("heading", { name: "Basic Usage" })
			).toBeVisible()
			await plain
				.locator(".sidebar summary")
				.filter({ hasText: "Reference" })
				.click()
			await plain
				.locator(".sidebar")
				.getByRole("link", { name: "API", exact: true })
				.click()
			await expect(
				plain.getByRole("heading", { name: "Custom streaming" })
			).toBeVisible()
			await noJS.close()
			console.log(
				`PASS Ask Widget ${base}: streaming, open/close, themes, mobile, no-JS reference`
			)
		}
	}
	if (process.env.DOCS_SCREENSHOT_DIR) {
		const demoOutput = join(temporary, "demo")
		const config = await loadConfig({
			cwd: fileURLToPath(new URL("../../apps/docs-demo/", import.meta.url)),
			overrides: { base: "/demo/" },
		})
		await buildAstroDocs({ ...config, outDirectory: demoOutput })
		outputs.set("/demo/", { output: demoOutput, cleanUrls: false })
		const demo = await browser.newPage()
		await demo.goto(origin + "/demo/")
		for (const theme of ["light", "dark"]) {
			await demo
				.getByRole("combobox", { name: "Color theme" })
				.selectOption(theme)
			for (const width of [375, 1440]) {
				await demo.setViewportSize({ width, height: 1000 })
				await demo.screenshot({
					path: join(
						process.env.DOCS_SCREENSHOT_DIR,
						`demo-${theme}-${width}.png`
					),
				})
			}
		}
		await demo.close()
	}
} finally {
	await browser?.close()
	if (server)
		await new Promise((resolve, reject) =>
			server.close((error) => (error ? reject(error) : resolve()))
		)
	await rm(temporary, { recursive: true, force: true })
}
