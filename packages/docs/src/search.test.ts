// @vitest-environment jsdom
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { afterEach, expect, it, vi } from "vitest"

const source = (
	await readFile(join(import.meta.dirname, "search.js"), "utf8")
).replaceAll("export function", "function")
const entries = [
	{
		title: "Home",
		heading: "",
		text: "Install packages safely",
		url: "/handbook/",
	},
	{
		title: "Install",
		heading: "Packages",
		text: "Use pnpm",
		url: "/handbook/install/#packages",
	},
]
function run() {
	return new Function(
		"document",
		`${source}; return { searchEntries, setupSearch }`
	)(document)
}
afterEach(() => {
	vi.unstubAllGlobals()
	document.body.replaceChildren()
})

it("ranks titles and headings, matches all terms, and handles empty/unicode queries", () => {
	const { searchEntries } = run()
	expect(searchEntries(entries, "INSTALL packages")[0].title).toBe("Install")
	expect(searchEntries(entries, "   ")).toEqual([])
	expect(searchEntries(entries, "missing")).toEqual([])
	expect(searchEntries(entries, "install missing")).toEqual([])
	expect(searchEntries(entries, "ｐｎｐｍ")).toHaveLength(1)
})

function mount() {
	document.body.innerHTML =
		'<header></header><button class="search-trigger" hidden>Search</button><dialog class="search-dialog" data-index="/handbook/search-index.json"><button class="search-close">Close</button><input><p role="status"></p><ul></ul></dialog>'
	const dialog = document.querySelector("dialog")!
	dialog.showModal = () => {
		dialog.open = true
	}
	dialog.close = () => {
		dialog.open = false
		dialog.dispatchEvent(new Event("close"))
	}
	run()
	return {
		dialog,
		input: document.querySelector("input")!,
		trigger: document.querySelector<HTMLButtonElement>(".search-trigger")!,
	}
}

it("loads once on demand, renders text safely, supports arrows and restores focus", async () => {
	const fetcher = vi
		.fn()
		.mockResolvedValue({ ok: true, json: async () => entries })
	vi.stubGlobal("fetch", fetcher)
	const { dialog, input, trigger } = mount()
	expect(fetcher).not.toHaveBeenCalled()
	trigger.click()
	await vi.waitFor(() =>
		expect(document.querySelector('[role="status"]')!.textContent).toBe(
			"Type to search."
		)
	)
	input.value = "packages"
	input.dispatchEvent(new Event("input"))
	expect(dialog.querySelectorAll("a")).toHaveLength(2)
	input.dispatchEvent(
		new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
	)
	expect(document.activeElement).toBe(dialog.querySelector("a"))
	dialog.querySelector<HTMLButtonElement>(".search-close")!.click()
	expect(document.activeElement).toBe(trigger)
	trigger.click()
	expect(fetcher).toHaveBeenCalledTimes(1)
	input.value = "nothing"
	input.dispatchEvent(new Event("input"))
	expect(dialog.textContent).toContain("No results")
})

it("reports fetch and unsafe-index errors and retries on reopening", async () => {
	const fetcher = vi
		.fn()
		.mockRejectedValueOnce(new Error("Offline"))
		.mockResolvedValueOnce({
			ok: true,
			json: async () => [{ ...entries[0], url: "//evil.example" }],
		})
		.mockResolvedValue({
			ok: true,
			json: async () => [
				{ ...entries[0], text: "<img src=x onerror=alert(1)>" },
			],
		})
	vi.stubGlobal("fetch", fetcher)
	const { dialog, input, trigger } = mount()
	for (let index = 0; index < 2; index++) {
		trigger.click()
		await vi.waitFor(() =>
			expect(dialog.textContent).toContain("Search could not load")
		)
		dialog.close()
	}
	trigger.click()
	await vi.waitFor(() => expect(dialog.textContent).toContain("Type to search"))
	input.value = "img"
	input.dispatchEvent(new Event("input"))
	expect(dialog.querySelector("img")).toBeNull()
	expect(dialog.querySelector("a")!.textContent).toContain("<img")
})
