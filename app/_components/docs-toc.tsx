"use client"

import { useEffect, useState } from "react"

import { usePathname } from "next/navigation"

import { Toc, type TocItem } from "@chitrank2050/monoline-ui/toc"

function slugify(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[\s\W-]+/g, "-")
		.replace(/^-+|-+$/g, "")
}

export function DocsToc() {
	const pathname = usePathname()
	const [items, setItems] = useState<TocItem[]>([])

	useEffect(() => {
		const main = document.getElementById("main-content")
		if (!main) return

		// Find all h2 and h3 elements except sr-only or nested inside code previews
		const headings = Array.from(main.querySelectorAll("h2, h3")).filter(
			(el) => {
				if (el.classList.contains("sr-only")) return false
				if (el.closest(".playground-canvas")) return false
				return true
			}
		)

		const tocItems: TocItem[] = headings.map((heading, index) => {
			let id = heading.id
			if (!id) {
				const text = heading.textContent || ""
				id = slugify(text) || `heading-${index}`
				heading.id = id
			}

			const depth = heading.tagName.toLowerCase() === "h3" ? 3 : 2

			return {
				id,
				label: heading.textContent || "",
				depth,
			}
		})

		setItems(tocItems)
	}, [pathname])

	if (items.length < 2) {
		return null
	}

	return (
		<aside className="docs-toc" aria-label="Table of contents">
			<div className="docs-toc__inner">
				<Toc
					items={items}
					variant="compact"
					heading="On This Page"
					scrollOffset={100}
				/>
			</div>
		</aside>
	)
}
