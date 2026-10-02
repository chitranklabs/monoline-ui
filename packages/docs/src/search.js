const normalize = (text) => text.normalize("NFKC").toLowerCase()

export function searchEntries(entries, query, scope = "all") {
	const terms = [
		...new Set(normalize(query).trim().split(/\s+/).filter(Boolean)),
	]
	if (!terms.length) return []
	// ponytail: linear scan suits small docs sites; use a dedicated index when measured search latency warrants it.
	return entries
		.filter((entry) => scope === "all" || entry.scope === scope)
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
	trigger.hidden = false
	const input = dialog.querySelector("input")
	const status = dialog.querySelector('[role="status"]')
	const results = dialog.querySelector("ul")
	const scopeButtons = [...dialog.querySelectorAll("[data-search-scope]")]
	let scope = "all"
	let entries
	let loading
	const recentKey = `monoline:recent-searches:${dialog.dataset.index}`
	function recent() {
		try {
			const value = JSON.parse(localStorage.getItem(recentKey) || "[]")
			return Array.isArray(value)
				? value.filter((item) => typeof item === "string").slice(0, 5)
				: []
		} catch {
			return []
		}
	}
	function remember(query) {
		try {
			localStorage.setItem(
				recentKey,
				JSON.stringify(
					[query, ...recent().filter((item) => item !== query)].slice(0, 5)
				)
			)
		} catch {
			/* Storage may be disabled. */
		}
	}
	function highlight(container, value, query) {
		const terms = [
			...new Set(normalize(query).trim().split(/\s+/).filter(Boolean)),
		]
		if (!terms.length) return container.append(value)
		const normalized = normalize(value)
		let cursor = 0
		while (cursor < value.length) {
			let position = value.length
			let length = 0
			for (const term of terms) {
				const found = normalized.indexOf(term, cursor)
				if (found >= 0 && found < position) {
					position = found
					length = term.length
				}
			}
			if (!length) {
				container.append(value.slice(cursor))
				break
			}
			container.append(value.slice(cursor, position))
			const mark = root.createElement("mark")
			mark.textContent = value.slice(position, position + length)
			container.append(mark)
			cursor = position + length
		}
	}
	function render() {
		results.replaceChildren()
		if (!entries) return
		const matches = searchEntries(entries, input.value, scope)
		status.textContent = !input.value.trim()
			? recent().length
				? "Recent searches."
				: "Type to search."
			: matches.length
				? `${matches.length} results${matches.length > 20 ? "; showing the first 20" : ""}.`
				: "No results. Try a different term."
		if (!input.value.trim())
			for (const query of recent()) {
				const item = root.createElement("li")
				const button = root.createElement("button")
				button.type = "button"
				button.textContent = query
				button.addEventListener("click", () => {
					input.value = query
					render()
					input.focus()
				})
				item.append(button)
				results.append(item)
			}
		for (const entry of matches.slice(0, 20)) {
			const item = root.createElement("li")
			const link = root.createElement("a")
			link.href = entry.url
			highlight(
				link,
				entry.heading ? `${entry.title} / ${entry.heading}` : entry.title,
				input.value
			)
			const snippet = root.createElement("p")
			const term = normalize(input.value).trim().split(/\s+/)[0]
			const start = Math.max(0, normalize(entry.text).indexOf(term) - 45)
			highlight(
				snippet,
				(start ? "…" : "") +
					entry.text.slice(start, start + 180) +
					(entry.text.length > start + 180 ? "…" : ""),
				input.value
			)
			link.addEventListener("click", () => remember(input.value.trim()))
			link.append(snippet)
			item.append(link)
			results.append(item)
		}
	}
	trigger.addEventListener("click", async () => {
		if (dialog.open) return
		root.querySelector(".nav-dialog[open]")?.close()
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
							(entry.scope !== undefined &&
								!["guide", "api"].includes(entry.scope)) ||
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
	root.addEventListener("keydown", (event) => {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
			event.preventDefault()
			trigger.click()
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
	for (const button of scopeButtons)
		button.addEventListener("click", () => {
			scope = button.dataset.searchScope
			for (const choice of scopeButtons)
				choice.setAttribute("aria-pressed", String(choice === button))
			render()
		})
	dialog.addEventListener("keydown", (event) => {
		// Native search inputs otherwise consume Escape to clear their value first.
		if (event.key === "Escape") {
			event.preventDefault()
			dialog.close()
			return
		}
		if (!["ArrowDown", "ArrowUp"].includes(event.key)) return
		const targets = [input, ...results.querySelectorAll("a, button")]
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
