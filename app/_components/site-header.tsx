"use client"

import { useEffect, useState } from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Navbar } from "@chitrank2050/monoline-ui/navbar"

import { primaryNav } from "../lib/docs-nav"
import { CommandPalette } from "./command-palette"
import { DocsNavigation } from "./docs-navigation"
import { ThemeControl } from "./theme-control"

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
			<Navbar layout="extended" sticky glass>
				<div className="flex min-w-0 items-center gap-4">
					<Link
						href="/"
						className="ml-navbar__brand"
						data-text-style="monoline"
					>
						<span className="ml-navbar__brand-label">
							monoline
							<span className="text-accent">/ui</span>
						</span>
					</Link>
					<span className="site-version">v0.2.0</span>
				</div>

				<Navbar.Nav>
					{primaryNav.map((item) => (
						<Navbar.Link
							key={item.href}
							asChild
							active={item.href ? isActive(pathname, item.href) : false}
						>
							<Link href={item.href ?? "/"}>{item.label}</Link>
						</Navbar.Link>
					))}
				</Navbar.Nav>

				<Navbar.Actions>
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
					<ThemeControl mode="mini" size="sm" />
				</Navbar.Actions>
			</Navbar>

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
