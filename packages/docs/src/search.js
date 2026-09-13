const normalize = (text) => text.normalize("NFKC").toLowerCase()

export function searchEntries(entries, query) {
	const terms = [
		...new Set(normalize(query).trim().split(/\s+/).filter(Boolean)),
	]
	if (!terms.length) return []
	// ponytail: linear scan suits small docs sites; use a dedicated index when measured search latency warrants it.
	return entries
		.map((entry) => {
			const title = normalize(entry.title)
			const heading = normalize(entry.heading)
			const body = normalize(entry.text)
			const score = terms.every((term) =>
				`${title} ${heading} ${body}`.includes(term)
			)
				? terms.reduce(
						(sum, term) =>
							sum +
							(title.includes(term) ? 6 : 0) +
							(heading.includes(term) ? 4 : 0) +
							(body.includes(term) ? 1 : 0),
						0
					)
				: 0
			return { ...entry, score }
		})
		.filter((entry) => entry.score > 0)
		.sort((a, b) => b.score - a.score || a.url.localeCompare(b.url))
}

export function setupSearch(root = document) {
	const dialog = root.querySelector(".search-dialog")
	const trigger = root.querySelector(".search-trigger")
	if (!dialog || !trigger || typeof dialog.showModal !== "function") return
	root.querySelector("header").append(trigger)
	trigger.hidden = false
	const input = dialog.querySelector("input")
	const status = dialog.querySelector('[role="status"]')
	const results = dialog.querySelector("ul")
	let entries
	let loading
	function render() {
		results.replaceChildren()
		if (!entries) return
		const matches = searchEntries(entries, input.value)
		status.textContent = !input.value.trim()
			? "Type to search."
			: matches.length
				? `${matches.length} results${matches.length > 20 ? "; showing the first 20" : ""}.`
				: "No results. Try a different term."
		for (const entry of matches.slice(0, 20)) {
			const item = root.createElement("li")
			const link = root.createElement("a")
			link.href = entry.url
			link.textContent = entry.heading
				? `${entry.title} / ${entry.heading}`
				: entry.title
			const snippet = root.createElement("p")
			const term = normalize(input.value).trim().split(/\s+/)[0]
			const start = Math.max(0, normalize(entry.text).indexOf(term) - 45)
			snippet.textContent =
				(start ? "…" : "") +
				entry.text.slice(start, start + 180) +
				(entry.text.length > start + 180 ? "…" : "")
			link.append(snippet)
			item.append(link)
			results.append(item)
		}
	}
	trigger.addEventListener("click", async () => {
		dialog.showModal()
		input.focus()
		if (entries) return render()
		status.textContent = "Loading search…"
		try {
			loading ??= fetch(dialog.dataset.index).then(async (response) => {
				if (!response.ok) throw new Error("Search unavailable")
				const data = await response.json()
				if (
					!Array.isArray(data) ||
					data.some(
						(entry) =>
							!entry ||
							!["title", "heading", "text", "url"].every(
								(key) => typeof entry[key] === "string"
							) ||
							!entry.url.startsWith("/") ||
							entry.url.startsWith("//") ||
							entry.url.includes("\\") ||
							[...entry.url].some((character) => character.charCodeAt(0) <= 32)
					)
				)
					throw new Error("Invalid search index")
				return data
			})
			entries = await loading
			render()
		} catch {
			loading = undefined
			status.textContent =
				"Search could not load. Close and reopen to retry, or use the navigation."
		}
	})
	dialog
		.querySelector(".search-close")
		.addEventListener("click", () => dialog.close())
	dialog.addEventListener("close", () => trigger.focus())
	results.addEventListener("click", (event) => {
		if (event.target.closest("a")) dialog.close()
	})
	input.addEventListener("input", render)
	dialog.addEventListener("keydown", (event) => {
		if (!["ArrowDown", "ArrowUp"].includes(event.key)) return
		const targets = [input, ...results.querySelectorAll("a")]
		const index = targets.indexOf(root.activeElement)
		if (index < 0) return
		event.preventDefault()
		targets[
			(index + (event.key === "ArrowDown" ? 1 : targets.length - 1)) %
				targets.length
		].focus()
	})
}

if (typeof document !== "undefined") setupSearch()
