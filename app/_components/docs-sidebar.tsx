"use client"

import { useEffect, useRef, useState } from "react"

import { DocsNavigation } from "./docs-navigation"

export function DocsSidebar() {
	const scrollRef = useRef<HTMLDivElement>(null)
	const [scrollState, setScrollState] = useState({
		canScrollUp: false,
		canScrollDown: false,
	})

	useEffect(() => {
		const node = scrollRef.current
		if (!node) return

		const updateScrollState = () => {
			const maxScrollTop = node.scrollHeight - node.clientHeight
			setScrollState({
				canScrollUp: node.scrollTop > 2,
				canScrollDown: maxScrollTop - node.scrollTop > 2,
			})
		}

		updateScrollState()
		const frame = requestAnimationFrame(updateScrollState)
		node.addEventListener("scroll", updateScrollState, { passive: true })
		window.addEventListener("resize", updateScrollState)

		return () => {
			cancelAnimationFrame(frame)
			node.removeEventListener("scroll", updateScrollState)
			window.removeEventListener("resize", updateScrollState)
		}
	}, [])

	return (
		<aside
			aria-label="Documentation navigation"
			className={[
				"docs-sidebar",
				scrollState.canScrollUp ? "docs-sidebar--fade-top" : "",
				scrollState.canScrollDown ? "docs-sidebar--fade-bottom" : "",
			]
				.filter(Boolean)
				.join(" ")}
		>
			<div className="docs-sidebar__scroll" ref={scrollRef}>
				<DocsNavigation variant="sidebar" />
			</div>
		</aside>
	)
}
