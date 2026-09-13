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
	localStorage.clear()
	document.documentElement.removeAttribute("data-theme")
	document.body.innerHTML =
		'<label class="theme-control" hidden><select><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></label><div class="code-block"><pre><code>const value = &quot;&lt;&amp;&gt;&quot;\n</code></pre><button class="copy-code" hidden>Copy</button><span class="copy-status" role="status"></span></div>'
})
afterEach(() => {
	vi.clearAllTimers()
	vi.useRealTimers()
	vi.restoreAllMocks()
})

it("restores a saved theme and persists light/dark/system selection", () => {
	localStorage.setItem("monoline-docs-theme", "dark")
	run(theme)
	run(client)
	expect(document.documentElement.dataset.theme).toBe("dark")
	const select = document.querySelector("select")!
	select.value = "system"
	select.dispatchEvent(new Event("change"))
	expect(localStorage.getItem("monoline-docs-theme")).toBe("system")
	expect(document.documentElement.dataset.theme).toBe("system")
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
	const select = document.querySelector("select")!
	select.value = "light"
	select.dispatchEvent(new Event("change"))
	expect(document.documentElement.dataset.theme).toBe("light")
})

it("copies source text and reports a clipboard failure without losing the code", async () => {
	const writeText = vi.fn().mockResolvedValue(undefined)
	Object.defineProperty(navigator, "clipboard", {
		configurable: true,
		value: { writeText },
	})
	run(client)
	const button = document.querySelector("button")!
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
