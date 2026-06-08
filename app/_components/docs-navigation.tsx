"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

import { componentNavGroups, foundationsNav, primaryNav } from "../lib/docs-nav"

type DocsNavigationVariant = "sidebar" | "drawer"

function isExactActive(pathname: string, href?: string) {
	return Boolean(href && !href.includes("#") && pathname === href)
}

function isSectionActive(pathname: string, href?: string) {
	if (!href) return false
	if (href === "/") return pathname === "/"

	const section = href.split("/")[1]
	return pathname.startsWith(section ? `/${section}` : href)
}

export function DocsNavigation({ variant }: { variant: DocsNavigationVariant }) {
	const pathname = usePathname()

	if (variant === "drawer") {
		return (
			<>
				<DrawerSection label="Menu">
					{primaryNav.map((item) => (
						<DrawerLink
							key={item.href}
							href={item.href}
							active={isSectionActive(pathname, item.href)}
						>
							{item.label}
						</DrawerLink>
					))}
				</DrawerSection>

				<DrawerSection label="Foundations">
					{foundationsNav
						.filter((item) => item.href && !item.href.includes("#"))
						.map((item) => (
							<DrawerLink
								key={item.href}
								href={item.href}
								active={isExactActive(pathname, item.href)}
							>
								{item.label}
							</DrawerLink>
						))}
				</DrawerSection>

				{componentNavGroups.map((group) => (
					<DrawerSection key={group.label} label={group.label}>
						{group.items.map((item) =>
							item.href ? (
								<DrawerLink
									key={item.label}
									href={item.href}
									active={isExactActive(pathname, item.href)}
								>
									{item.label}
								</DrawerLink>
							) : (
								<span key={item.label} className="site-menu-drawer__item is-muted">
									{item.label}
								</span>
							)
						)}
					</DrawerSection>
				))}
			</>
		)
	}

	return (
		<>
			<SidebarSection label="Foundations">
				{foundationsNav.map((item) =>
					item.href ? (
						<SidebarLink
							key={item.label}
							href={item.href}
							active={isExactActive(pathname, item.href)}
						>
							<span>{item.label}</span>
						</SidebarLink>
					) : null
				)}
			</SidebarSection>

			{componentNavGroups.map((group) => (
				<SidebarSection key={group.label} label={group.label}>
					{group.items.map((item) =>
						item.href ? (
							<SidebarLink
								key={item.label}
								href={item.href}
								active={isExactActive(pathname, item.href)}
							>
								<span>{item.label}</span>
								{item.meta ? (
									<span className="docs-sidebar__meta">{item.meta}</span>
								) : null}
							</SidebarLink>
						) : (
							<span key={item.label} className="docs-sidebar__item">
								<span>{item.label}</span>
								{item.meta ? (
									<span className="docs-sidebar__meta">{item.meta}</span>
								) : null}
							</span>
						)
					)}
				</SidebarSection>
			))}
		</>
	)
}

function SidebarSection({
	label,
	children,
}: {
	label: string
	children: ReactNode
}) {
	return (
		<div className="docs-sidebar__group">
			<p className="ml-eyebrow">{label}</p>
			<nav className="docs-sidebar__nav">{children}</nav>
		</div>
	)
}

function SidebarLink({
	href,
	active,
	children,
}: {
	href: string
	active: boolean
	children: ReactNode
}) {
	return (
		<Link
			href={href}
			aria-current={active ? "page" : undefined}
			className="docs-sidebar__item ml-interaction-surface"
		>
			{children}
		</Link>
	)
}

function DrawerSection({
	label,
	children,
}: {
	label: string
	children: ReactNode
}) {
	return (
		<section className="site-menu-drawer__section">
			<p>{label}</p>
			<div>{children}</div>
		</section>
	)
}

function DrawerLink({
	href,
	active,
	children,
}: {
	href?: string
	active: boolean
	children: ReactNode
}) {
	return (
		<Link
			href={href ?? "/"}
			className="site-menu-drawer__item"
			aria-current={active ? "page" : undefined}
		>
			{children}
		</Link>
	)
}
