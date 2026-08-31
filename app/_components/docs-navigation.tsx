"use client"

import type { ReactNode } from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
	componentsNav,
	foundationsSidebarNav,
	sectionsNav,
} from "../lib/docs-nav"

type DocsNavigationVariant = "sidebar" | "drawer"

function isExactActive(pathname: string, href?: string) {
	return Boolean(href && !href.includes("#") && pathname === href)
}

export function DocsNavigation({
	variant,
}: {
	variant: DocsNavigationVariant
}) {
	const pathname = usePathname()

	if (variant === "drawer") {
		return (
			<>
				<DrawerSection label="Sections">
					{sectionsNav.map((item) => (
						<DrawerLink
							key={item.href}
							href={item.href ?? "/"}
							active={isExactActive(pathname, item.href)}
						>
							{item.label}
						</DrawerLink>
					))}
				</DrawerSection>

				<DrawerSection label="Foundation">
					{foundationsSidebarNav.map((item) => (
						<DrawerLink
							key={item.href}
							href={item.href ?? "/"}
							active={isExactActive(pathname, item.href)}
						>
							{item.label}
						</DrawerLink>
					))}
				</DrawerSection>

				<DrawerSection label="Components">
					{componentsNav.map((item) => (
						<DrawerLink
							key={item.href}
							href={item.href ?? "/"}
							active={isExactActive(pathname, item.href)}
						>
							{item.label}
						</DrawerLink>
					))}
				</DrawerSection>
			</>
		)
	}

	return (
		<>
			<SidebarSection label="Sections">
				{sectionsNav.map((item) => (
					<SidebarLink
						key={item.href}
						href={item.href ?? "/"}
						active={isExactActive(pathname, item.href)}
					>
						<span>{item.label}</span>
					</SidebarLink>
				))}
			</SidebarSection>

			<SidebarSection label="Foundation">
				{foundationsSidebarNav.map((item) => (
					<SidebarLink
						key={item.href}
						href={item.href ?? "/"}
						active={isExactActive(pathname, item.href)}
					>
						<span>{item.label}</span>
					</SidebarLink>
				))}
			</SidebarSection>

			<SidebarSection label="Components">
				{componentsNav.map((item) =>
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
		<section className="mb-8">
			<p className="mb-3.5 text-text-muted font-semibold">{label}</p>
			<div className="grid gap-3">{children}</div>
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
			className="flex items-center justify-between text-text no-underline text-[clamp(1.625rem,7vw,2.25rem)] font-bold leading-[1.1] aria-[current=page]:text-accent"
			aria-current={active ? "page" : undefined}
		>
			{children}
		</Link>
	)
}
