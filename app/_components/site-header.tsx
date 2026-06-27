"use client"

import { useCallback, useEffect, useRef, useState } from "react"

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
	const menuButtonRef = useRef<HTMLButtonElement>(null)

	const closeMenu = useCallback(() => {
		setMenuOpen(false)
		menuButtonRef.current?.focus()
	}, [])

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
		if (!menuOpen) return

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault()
				closeMenu()
			}
		}

		window.addEventListener("keydown", onKeyDown)
		return () => window.removeEventListener("keydown", onKeyDown)
	}, [menuOpen, closeMenu])

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
				<div className="flex min-w-0 items-center gap-ml-3">
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
						className="flex w-45 h-8 items-center gap-1.75 border border-border rounded-md bg-surface pl-2.5 pr-1.5 text-text-muted cursor-pointer outline-none transition-[border-color,background] duration-(--duration-fast) ease-out hover:border-border-strong focus-visible:border-border-strong focus-visible:shadow-(--focus-ring)"
						onClick={() => setPaletteOpen(true)}
						aria-label="Search components (⌘K)"
					>
						<span aria-hidden="true">⌕</span>
						<span className="flex-1 text-left text-2xs text-text-muted whitespace-nowrap overflow-hidden text-ellipsis">
							Search components
						</span>
						<kbd className="border border-border rounded-xs py-0.5 px-1.25 font-mono text-3xs font-bold shrink-0">
							⌘K
						</kbd>
					</button>
					<a
						className="inline-flex items-center gap-1.25 whitespace-nowrap text-text-secondary text-xs font-bold transition-colors duration-(--duration-micro) ease-out hover:text-text"
						href="https://github.com"
					>
						GitHub
					</a>
					<ThemeControl mode="mini" size="sm" />
				</Navbar.Actions>

				<button
					ref={menuButtonRef}
					type="button"
					className="site-menu-button hidden col-start-3 w-9 h-9 flex-col items-center justify-center justify-self-end gap-1 border border-border rounded-md bg-surface text-text cursor-pointer outline-none transition-[border-color,box-shadow] duration-(--duration-fast) ease-out hover:border-border-strong focus-visible:border-border-strong focus-visible:shadow-(--focus-ring)"
					aria-label="Open menu"
					aria-controls="site-menu-drawer"
					aria-expanded={menuOpen}
					onClick={() => setMenuOpen(true)}
				>
					<span className="w-3.5 h-0.5 rounded-full bg-current" />
					<span className="w-3.5 h-0.5 rounded-full bg-current" />
				</button>
			</Navbar>

			<CommandPalette
				open={paletteOpen}
				onClose={() => setPaletteOpen(false)}
			/>
			<MobileMenu
				open={menuOpen}
				onClose={closeMenu}
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
			id="site-menu-drawer"
			className="site-menu-drawer"
			role="dialog"
			aria-modal="true"
			aria-label="Menu"
		>
			<div className="grid grid-cols-[auto_auto_1fr] items-center gap-3.5 h-14 px-5 text-text text-xl font-bold">
				<button
					type="button"
					className="relative w-6 h-6 border-0 bg-transparent text-text cursor-pointer"
					aria-label="Close menu"
					onClick={onClose}
				>
					<span className="absolute top-1/2 left-0.5 w-5 h-0.5 rounded-full bg-current rotate-45" />
					<span className="absolute top-1/2 left-0.5 w-5 h-0.5 rounded-full bg-current -rotate-45" />
				</button>
				<span>Menu</span>
				<button
					type="button"
					className="justify-self-end w-[min(18rem,40vw)] border border-border rounded-lg bg-surface py-2.5 px-4 text-text-muted text-left text-sm max-[32.5rem]:hidden"
					onClick={onSearch}
				>
					Search…
				</button>
			</div>

			<div className="site-menu-drawer__body relative flex-1 overflow-y-auto py-8 px-6 pb-20">
				<DocsNavigation variant="drawer" />
			</div>
		</div>
	)
}
