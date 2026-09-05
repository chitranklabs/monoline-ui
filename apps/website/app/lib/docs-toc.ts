export interface DocsTocItem {
	id: string
	label: string
	depth: 2
}

function slugify(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[\s\W-]+/g, "-")
		.replace(/^-+|-+$/g, "")
}

export function collectDocsTocItems(main: HTMLElement): DocsTocItem[] {
	const headings = Array.from(main.querySelectorAll<HTMLHeadingElement>("h2"))
	const usedIds = new Set<string>()
	const items: DocsTocItem[] = []

	for (const heading of headings) {
		if (heading.classList.contains("sr-only")) continue
		if (
			heading.closest(
				'.playground-canvas, [data-toc-exclude], [hidden], [aria-hidden="true"]'
			)
		) {
			continue
		}

		const label = (heading.dataset.tocLabel ?? heading.textContent ?? "")
			.replace(/\s+/g, " ")
			.trim()
		if (!label) continue

		const baseId = heading.id || slugify(label) || `section-${items.length + 1}`
		let id = baseId
		let duplicateIndex = 2
		while (usedIds.has(id)) {
			id = `${baseId}-${duplicateIndex}`
			duplicateIndex += 1
		}

		heading.id = id
		usedIds.add(id)
		items.push({ id, label, depth: 2 })
	}

	return items
}
