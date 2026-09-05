"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@chitrank2050/monoline-ui/button"

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
				<Button asChild variant="secondary" size="md">
					<Link href={previous.href}>
						<Button.Icon side="left">←</Button.Icon>
						<span>{previous.label}</span>
					</Link>
				</Button>
			) : (
				<span />
			)}
			{next?.href ? (
				<Button asChild variant="secondary" size="md" className="ml-auto">
					<Link href={next.href}>
						<span>{next.label}</span>
						<Button.Icon>→</Button.Icon>
					</Link>
				</Button>
			) : null}
		</nav>
	)
}
