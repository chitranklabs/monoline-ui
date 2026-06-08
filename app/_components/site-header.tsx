"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { CommandPalette } from "./command-palette"
import { DocsNavigation } from "./docs-navigation"
import { useTheme } from "./theme-provider"
import { primaryNav } from "../lib/docs-nav"

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
	const [menuOpen, setMenuOpen] = useState(false)
	const { theme, toggleTheme } = useTheme()

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

	useEffect(() => {
		setMenuOpen(false)
	}, [pathname])

	useEffect(() => {
		const previousOverflow = document.body.style.overflow
		if (menuOpen) {
			document.body.style.overflow = "hidden"
		}

		return () => {
			document.body.style.overflow = previousOverflow
		}
	}, [menuOpen])

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
						{primaryNav.map((item) => (
							<Link
								key={item.href}
								href={item.href ?? "/"}
								aria-current={
									item.href && isActive(pathname, item.href)
										? "page"
										: undefined
								}
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
							onClick={toggleTheme}
						>
							{theme === "light" ? "☼" : "☾"}
						</button>
					</div>

					<button
						className="site-menu-button ml-interaction-control"
						type="button"
						aria-label={menuOpen ? "Close menu" : "Open menu"}
						aria-expanded={menuOpen}
						onClick={() => setMenuOpen((open) => !open)}
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
			<MobileMenu
				open={menuOpen}
				onClose={() => setMenuOpen(false)}
				onSearch={() => {
					setMenuOpen(false)
					setPaletteOpen(true)
				}}
			/>
		</>
	)
}

function MobileMenu({
	open,
	onClose,
	onSearch,
}: {
	open: boolean
	onClose: () => void
	onSearch: () => void
}) {
	if (!open) {
		return null
	}

	return (
		<div
			className="site-menu-drawer"
			role="dialog"
			aria-modal="true"
			aria-label="Menu"
		>
			<div className="site-menu-drawer__bar">
				<button
					type="button"
					className="site-menu-drawer__close"
					aria-label="Close menu"
					onClick={onClose}
				>
					<span />
					<span />
				</button>
				<span>Menu</span>
				<button
					type="button"
					className="site-menu-drawer__search"
					onClick={onSearch}
				>
					Search…
				</button>
			</div>

			<div className="site-menu-drawer__body">
				<DocsNavigation variant="drawer" />
			</div>
		</div>
	)
}
