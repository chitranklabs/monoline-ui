"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { componentNavGroups, foundationsNav } from "../lib/docs-nav"

function isActivePath(pathname: string, href?: string) {
	if (!href) {
		return false
	}

	const [pathOnly] = href.split("#")
	return pathname === pathOnly
}

export function DocsSidebar() {
	const pathname = usePathname()

	return (
		<aside className="docs-sidebar">
			<div className="docs-sidebar__group">
				<p className="ml-eyebrow">Foundations</p>
				<nav className="docs-sidebar__nav">
					{foundationsNav.map((item) =>
						item.href ? (
							<Link
								key={item.label}
								href={item.href}
								aria-current={
									isActivePath(pathname, item.href) ? "page" : undefined
								}
								className="docs-sidebar__item"
							>
								<span>{item.label}</span>
							</Link>
						) : null
					)}
				</nav>
			</div>

			{componentNavGroups.map((group) => (
				<div key={group.label} className="docs-sidebar__group">
					<p className="ml-eyebrow">{group.label}</p>
					<nav className="docs-sidebar__nav">
						{group.items.map((item) =>
							item.href ? (
								<Link
									key={item.label}
									href={item.href}
									aria-current={
										isActivePath(pathname, item.href) ? "page" : undefined
									}
									className="docs-sidebar__item"
								>
									<span>{item.label}</span>
									{item.meta ? (
										<span className="docs-sidebar__meta">{item.meta}</span>
									) : null}
								</Link>
							) : (
								<span key={item.label} className="docs-sidebar__item">
									<span>{item.label}</span>
									{item.meta ? (
										<span className="docs-sidebar__meta">{item.meta}</span>
									) : null}
								</span>
							)
						)}
					</nav>
				</div>
			))}
		</aside>
	)
}
