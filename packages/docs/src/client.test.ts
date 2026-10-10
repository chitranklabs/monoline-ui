// @vitest-environment jsdom
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { afterEach, beforeEach, expect, it, vi } from "vitest"

const theme = await readFile(join(import.meta.dirname, "theme.js"), "utf8")
const client = await readFile(join(import.meta.dirname, "client.js"), "utf8")
function run(
	source: string,
	storage: Pick<Storage, "getItem" | "setItem"> = window.localStorage
) {
	new Function("document", "navigator", "localStorage", source)(
		document,
		navigator,
		storage
	)
}
beforeEach(() => {
	vi.useFakeTimers()
	vi.stubGlobal("matchMedia", () => ({
		matches: false,
		addEventListener: vi.fn(),
	}))
	localStorage.clear()
	document.documentElement.removeAttribute("data-theme")
	document.body.innerHTML =
		'<button class="theme-control" hidden></button><div class="code-block"><pre><code>const value = &quot;&lt;&amp;&gt;&quot;\n</code></pre><button class="copy-code" hidden>Copy</button><span class="copy-status" role="status"></span></div>'
})
afterEach(() => {
	vi.clearAllTimers()
	vi.useRealTimers()
	vi.restoreAllMocks()
	vi.unstubAllGlobals()
})

it("restores a saved theme and toggles/persists light and dark", () => {
	localStorage.setItem("monoline-docs-theme", "dark")
	run(theme)
	run(client)
	expect(document.documentElement.dataset.theme).toBe("dark")
	const toggle = document.querySelector<HTMLButtonElement>(".theme-control")!
	toggle.click()
	expect(localStorage.getItem("monoline-docs-theme")).toBe("light")
	expect(document.documentElement.dataset.theme).toBe("light")
	expect(toggle.getAttribute("aria-label")).toBe("Switch to dark theme")
	toggle.click()
	expect(document.documentElement.dataset.theme).toBe("dark")
	expect(localStorage.getItem("monoline-docs-theme")).toBe("dark")
})

it("toggles from the effective system theme to an explicit saved preference", () => {
	vi.stubGlobal("matchMedia", () => ({
		matches: true,
		addEventListener: vi.fn(),
	}))
	document.documentElement.dataset.theme = "system"
	run(client)
	const toggle = document.querySelector<HTMLButtonElement>(".theme-control")!
	expect(toggle.getAttribute("aria-label")).toBe("Switch to light theme")
	toggle.click()
	expect(document.documentElement.dataset.theme).toBe("light")
	expect(localStorage.getItem("monoline-docs-theme")).toBe("light")
})

it("respects the configured default unless a valid saved choice overrides it", () => {
	document.documentElement.dataset.theme = "dark"
	run(theme)
	expect(document.documentElement.dataset.theme).toBe("dark")
	localStorage.setItem("monoline-docs-theme", "system")
	run(theme)
	expect(document.documentElement.dataset.theme).toBe("system")
	localStorage.setItem("monoline-docs-theme", "invalid")
	document.documentElement.dataset.theme = "light"
	run(theme)
	expect(document.documentElement.dataset.theme).toBe("light")
})

it("works when persistent storage is unavailable", () => {
	const storage = {
		getItem() {
			throw new Error("Storage denied")
		},
		setItem() {
			throw new Error("Storage denied")
		},
	}
	expect(() => {
		run(theme, storage)
		run(client, storage)
	}).not.toThrow()
	document.querySelector<HTMLButtonElement>(".theme-control")!.click()
	expect(document.documentElement.dataset.theme).toBe("dark")
})

it("copies source text and reports a clipboard failure without losing the code", async () => {
	const writeText = vi.fn().mockResolvedValue(undefined)
	Object.defineProperty(navigator, "clipboard", {
		configurable: true,
		value: { writeText },
	})
	run(client)
	const button = document.querySelector<HTMLButtonElement>(".copy-code")!
	button.click()
	await Promise.resolve()
	expect(document.querySelector(".copy-status")!.textContent).toBe("Copied")
	expect(writeText).toHaveBeenCalledWith('const value = "<&>"\n')
	writeText.mockRejectedValueOnce(new Error("Denied"))
	button.click()
	await Promise.resolve()
	expect(document.querySelector(".copy-status")!.textContent).toContain(
		"Copy failed"
	)
	expect(button.disabled).toBe(false)
})

it("guards overlapping page-copy requests with a busy state", async () => {
	document.body.insertAdjacentHTML(
		"beforeend",
		'<button class="copy-page-link" hidden>Copy page link</button><span class="copy-page-status" role="status"></span>'
	)
	let finish: (() => void) | undefined
	const writeText = vi.fn(
		() =>
			new Promise<void>((resolve) => {
				finish = resolve
			})
	)
	Object.defineProperty(navigator, "clipboard", {
		configurable: true,
		value: { writeText },
	})
	run(client)
	const button = document.querySelector<HTMLButtonElement>(".copy-page-link")!
	button.click()
	button.click()
	expect(writeText).toHaveBeenCalledTimes(1)
	expect(button.getAttribute("aria-busy")).toBe("true")
	expect(button.disabled).toBe(false)
	finish!()
	await Promise.resolve()
	expect(button.hasAttribute("aria-busy")).toBe(false)
	expect(document.querySelector(".copy-page-status")!.textContent).toBe(
		"Copied"
	)
})

it("keeps preview links and form submissions local without blocking controls or page links", () => {
	document.body.insertAdjacentHTML(
		"beforeend",
		'<div class="docs-preview-content"><a href="/deployment/"><span>Demo</span></a><button>Control</button><form></form></div><a id="real-link" href="/writing/">Writing</a>'
	)
	run(client)
	const dispatch = (selector: string, type: string) => {
		const event = new MouseEvent(type, { bubbles: true, cancelable: true })
		document.querySelector(selector)!.dispatchEvent(event)
		return event.defaultPrevented
	}
	expect(dispatch(".docs-preview-content a span", "click")).toBe(true)
	expect(dispatch(".docs-preview-content a", "auxclick")).toBe(true)
	expect(dispatch(".docs-preview-content form", "submit")).toBe(true)
	expect(dispatch(".docs-preview-content button", "click")).toBe(false)
	expect(dispatch("#real-link", "click")).toBe(false)
})

it("selects the last section at the end, honors TOC clicks, and resumes on scroll input", () => {
	document.body.innerHTML =
		'<aside class="toc"><a href="#first">First</a><a href="#middle">Middle</a><a href="#last">Last</a></aside><article><h2 id="first">First</h2><h2 id="middle">Middle</h2><h2 id="last">Last</h2></article>'
	vi.stubGlobal("scrollY", 700)
	vi.stubGlobal("innerHeight", 900)
	const callbacks: FrameRequestCallback[] = []
	vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
		callbacks.push(callback)
		return callbacks.length
	})
	for (const [index, heading] of [...document.querySelectorAll("h2")].entries())
		vi.spyOn(heading, "getBoundingClientRect").mockReturnValue({
			top: [-190, 176, 415][index],
		} as DOMRect)
	run(client)
	callbacks[0]!(0)
	expect(
		document.querySelector('.toc [aria-current="location"]')?.textContent
	).toBe("Last")
	document.querySelector<HTMLAnchorElement>('.toc a[href="#middle"]')!.click()
	callbacks.at(-1)!(0)
	expect(
		document.querySelector('.toc [aria-current="location"]')?.textContent
	).toBe("Middle")
	window.dispatchEvent(new WheelEvent("wheel"))
	callbacks.at(-1)!(0)
	expect(
		document.querySelector('.toc [aria-current="location"]')?.textContent
	).toBe("Last")
})
