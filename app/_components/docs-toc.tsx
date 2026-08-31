"use client"

import { useEffect, useState } from "react"

import { usePathname } from "next/navigation"

import { Toc, type TocItem } from "@chitrank2050/monoline-ui/toc"

import { collectDocsTocItems } from "../lib/docs-toc"

export function DocsToc() {
	const pathname = usePathname()
	const [items, setItems] = useState<TocItem[]>([])

	useEffect(() => {
		const main = document.getElementById("main-content")
		if (!main) return

		const updateItems = () => {
			const nextItems = collectDocsTocItems(main) satisfies TocItem[]
			setItems((prev) => {
				if (
					prev.length === nextItems.length &&
					prev.every(
						(p, idx) =>
							p.id === nextItems[idx]?.id &&
							p.label === nextItems[idx]?.label &&
							p.depth === nextItems[idx]?.depth
					)
				) {
					return prev
				}
				return nextItems
			})
		}

		updateItems()

		const observer = new MutationObserver(() => {
			updateItems()
		})

		observer.observe(main, {
			childList: true,
			subtree: true,
		})

		return () => {
			observer.disconnect()
		}
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
