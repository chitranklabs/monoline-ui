"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

import { useRouter } from "next/navigation"

import { Command } from "cmdk"

import { componentNavGroups, foundationsNav } from "../lib/docs-nav"

/* ── Search index ─────────────────────────────────────── */
const TOP_PAGES = [
	{ label: "Introduction", href: "/" },
	{ label: "Installation", href: "/installation" },
]

const FOUNDATIONS = foundationsNav.map((item) => ({
	label: item.label,
	href: item.href ?? "#",
}))

const COMPONENT_GROUPS = componentNavGroups.map((group) => ({
	label: group.label,
	items: group.items.map((item) => ({
		label: item.label,
		href: item.href ?? "#",
		meta: item.meta,
	})),
}))

/* ── Component ────────────────────────────────────────── */
interface CommandPaletteProps {
	open: boolean
	onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
	const router = useRouter()
	const [query, setQuery] = useState("")
	// Track whether we're mounted on the client
	const [isBrowser, setIsBrowser] = useState(false)
	const prevOpen = useRef(false)

	useEffect(() => {
		setIsBrowser(true)
	}, [])

	// Reset query when freshly opened
	useEffect(() => {
		if (open && !prevOpen.current) {
			setQuery("")
		}
		prevOpen.current = open
	}, [open])

	// Body scroll lock - always runs, never skips cleanup
	useEffect(() => {
		if (!open) return
		const prev = document.body.style.overflow
		document.body.style.overflow = "hidden"
		return () => {
			document.body.style.overflow = prev
		}
	}, [open])

	function navigate(href: string) {
		if (href === "#") return
		router.push(href)
		onClose()
	}

	// Don't render on server, don't render when closed
	if (!isBrowser || !open) return null

	return createPortal(
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			className="cmd-backdrop"
			onMouseDown={(e) => {
				if (e.target === e.currentTarget) onClose()
			}}
		>
			<Command
				className="cmd-panel"
				label="Command palette"
				shouldFilter={true}
			>
				{/* Search row */}
				<div className="cmd-search-row">
					<span className="cmd-search-icon" aria-hidden="true">
						⌕
					</span>
					<Command.Input
						className="cmd-input"
						placeholder="Search components, pages…"
						value={query}
						onValueChange={setQuery}
						onKeyDown={(e) => {
							if (e.key === "Escape") onClose()
						}}
						/* eslint-disable-next-line jsx-a11y/no-autofocus */
						autoFocus
					/>
					<button
						type="button"
						className="cmd-esc ml-interaction-control"
						onClick={onClose}
						aria-label="Close command palette"
					>
						esc
					</button>
				</div>

				{/* Results */}
				<Command.List className="cmd-results">
					<Command.Empty className="cmd-empty">
						No results for &ldquo;{query}&rdquo;
					</Command.Empty>

					<Command.Group heading="Pages" className="cmd-group">
						{TOP_PAGES.map((item) => (
							<Command.Item
								key={item.href}
								value={item.label}
								className="cmd-item"
								onSelect={() => navigate(item.href)}
							>
								<span className="cmd-item__label">{item.label}</span>
								<span className="cmd-item__arrow" aria-hidden="true">
									↵
								</span>
							</Command.Item>
						))}
					</Command.Group>

					<Command.Group heading="Foundations" className="cmd-group">
						{FOUNDATIONS.map((item) => (
							<Command.Item
								key={item.href}
								value={item.label}
								className="cmd-item"
								onSelect={() => navigate(item.href)}
							>
								<span className="cmd-item__label">{item.label}</span>
								<span className="cmd-item__arrow" aria-hidden="true">
									↵
								</span>
							</Command.Item>
						))}
					</Command.Group>

					{COMPONENT_GROUPS.map((group) => (
						<Command.Group
							key={group.label}
							heading={group.label}
							className="cmd-group"
						>
							{group.items.map((item) => (
								<Command.Item
									key={`${group.label}-${item.label}`}
									value={`${item.label} ${group.label}`}
									className="cmd-item"
									onSelect={() => navigate(item.href)}
									disabled={item.href === "#"}
								>
									<span className="cmd-item__label">{item.label}</span>
									{item.meta && (
										<span className="cmd-item__meta">{item.meta}</span>
									)}
									{item.href !== "#" && (
										<span className="cmd-item__arrow" aria-hidden="true">
											↵
										</span>
									)}
								</Command.Item>
							))}
						</Command.Group>
					))}
				</Command.List>

				{/* Keyboard hints */}
				<div className="cmd-footer">
					<span>
						<kbd>↑↓</kbd> navigate
					</span>
					<span>
						<kbd>↵</kbd> open
					</span>
					<span>
						<kbd>esc</kbd> close
					</span>
				</div>
			</Command>
		</div>,
		document.body
	)
}
