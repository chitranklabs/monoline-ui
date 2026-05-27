"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

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

	return (
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
							className="site-nav__item"
						>
							{item.label}
						</Link>
					))}
				</nav>

				<div className="site-actions">
					<label className="site-search">
						<span aria-hidden="true">⌕</span>
						<span className="sr-only">Search components</span>
						<input placeholder="Search components" />
						<kbd>⌘K</kbd>
					</label>
					<a className="site-action-link" href="https://github.com">
						GitHub
					</a>
					<a className="site-action-link" href="https://figma.com">
						<span aria-hidden="true">∞</span>
						<span>Figma</span>
					</a>
					<button
						className="site-theme-button"
						type="button"
						aria-label="Theme"
					>
						☼
					</button>
				</div>

				<button
					className="site-menu-button"
					type="button"
					aria-label="Open menu"
				>
					<span />
					<span />
					<span />
				</button>
			</div>
		</header>
	)
}
