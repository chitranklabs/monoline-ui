"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { CommandPalette } from "./command-palette"

const navItems = [
	{ href: "/", label: "Introduction" },
	{ href: "/installation", label: "Installation" },
	{ href: "/foundations/colors", label: "Foundations" },
	{ href: "/components/footer", label: "Components" },
]

function isActive(pathname: string, href: string) {
	if (href === "/") {
		return pathname === "/"
	}

	return pathname.startsWith(
		href.split("/")[1] ? `/${href.split("/")[1]}` : href
	)
}

export function SiteHeader() {
	const pathname = usePathname()
	const [paletteOpen, setPaletteOpen] = useState(false)

	// ⌘K global shortcut
	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault()
				setPaletteOpen((v) => !v)
			}
		}
		window.addEventListener("keydown", onKey)
		return () => window.removeEventListener("keydown", onKey)
	}, [])

	return (
		<>
			<header className="site-header">
				<div className="site-header__inner">
					<div className="flex min-w-0 items-center gap-4">
						<Link href="/" className="site-wordmark" aria-label="monoline ui">
							<span>monoline</span>
							<span className="text-accent">/ui</span>
						</Link>
						<span className="site-version">v0.2.0</span>
					</div>

					<nav className="site-nav" aria-label="Primary navigation">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								aria-current={isActive(pathname, item.href) ? "page" : undefined}
								className="site-nav__item ml-interaction-color"
							>
								{item.label}
							</Link>
						))}
					</nav>

					<div className="site-actions">
						<button
							type="button"
							className="site-search"
							onClick={() => setPaletteOpen(true)}
							aria-label="Search components (⌘K)"
						>
							<span aria-hidden="true">⌕</span>
							<span className="site-search__text">Search components</span>
							<kbd>⌘K</kbd>
						</button>
						<a
							className="site-action-link ml-interaction-color"
							href="https://github.com"
						>
							GitHub
						</a>
						<button
							className="site-theme-button ml-interaction-control"
							type="button"
							aria-label="Theme"
						>
							☼
						</button>
					</div>

					<button
						className="site-menu-button ml-interaction-control"
						type="button"
						aria-label="Open menu"
					>
						<span />
						<span />
						<span />
					</button>
				</div>
			</header>

			<CommandPalette
				open={paletteOpen}
				onClose={() => setPaletteOpen(false)}
			/>
		</>
	)
}
