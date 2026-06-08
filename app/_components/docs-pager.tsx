"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { docsPagerNav } from "../lib/docs-nav"

export function DocsPager() {
	const pathname = usePathname()

	if (pathname === "/") {
		return null
	}

	const currentIndex = docsPagerNav.findIndex((item) => item.href === pathname)
	const previous = currentIndex > 0 ? docsPagerNav[currentIndex - 1] : undefined
	const next =
		currentIndex >= 0 && currentIndex < docsPagerNav.length - 1
			? docsPagerNav[currentIndex + 1]
			: undefined

	if (!previous && !next) {
		return null
	}

	return (
		<nav className="docs-pager" aria-label="Page navigation">
			{previous?.href ? (
				<Link
					href={previous.href}
					className="docs-pager__link docs-pager__link--prev"
				>
					<span aria-hidden="true">←</span>
					<span>{previous.label}</span>
				</Link>
			) : (
				<span />
			)}
			{next?.href ? (
				<Link
					href={next.href}
					className="docs-pager__link docs-pager__link--next"
				>
					<span>{next.label}</span>
					<span aria-hidden="true">→</span>
				</Link>
			) : null}
		</nav>
	)
}
