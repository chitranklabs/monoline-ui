"use client"

import { useRouter } from "next/navigation"

import { CommandSearch } from "@chitrank2050/monoline-ui/command-search"

import { componentNavGroups, foundationsNav, guidesNav } from "../lib/docs-nav"
import { routes } from "../lib/routes"

const TOP_PAGES = [
	{ label: "Home", href: "/" },
	...guidesNav.map((item) => ({
		label: item.label,
		href: item.href ?? "#",
	})),
	{ label: "Components", href: "/docs/components" },
	{ label: "Changelog", href: routes.docs.changelog },
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

interface CommandPaletteProps {
	open: boolean
	onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
	const router = useRouter()

	function navigate(href: string) {
		if (href === "#") return
		router.push(href)
		onClose()
	}

	return (
		<CommandSearch
			open={open}
			onOpenChange={(nextOpen) => {
				if (!nextOpen) onClose()
			}}
			placeholder="Search docs…"
			showFooter
		>
			<CommandSearch.Input placeholder="Search docs, components, tokens…" />
			<CommandSearch.List>
				<CommandSearch.Empty>No results found.</CommandSearch.Empty>

				<CommandSearch.Group heading="Pages">
					{TOP_PAGES.map((item) => (
						<CommandSearch.Item
							key={item.href}
							value={item.label}
							onSelect={() => navigate(item.href)}
						>
							<span className="flex-1">{item.label}</span>
							<span
								className="text-text-muted font-mono text-3xs"
								aria-hidden="true"
							>
								↵
							</span>
						</CommandSearch.Item>
					))}
				</CommandSearch.Group>

				<CommandSearch.Group heading="Foundations">
					{FOUNDATIONS.map((item) => (
						<CommandSearch.Item
							key={item.href}
							value={item.label}
							onSelect={() => navigate(item.href)}
						>
							<span className="flex-1">{item.label}</span>
							<span
								className="text-text-muted font-mono text-3xs"
								aria-hidden="true"
							>
								↵
							</span>
						</CommandSearch.Item>
					))}
				</CommandSearch.Group>

				{COMPONENT_GROUPS.map((group) => (
					<CommandSearch.Group key={group.label} heading={group.label}>
						{group.items.map((item) => (
							<CommandSearch.Item
								key={`${group.label}-${item.label}`}
								value={`${item.label} ${group.label}`}
								onSelect={() => navigate(item.href)}
								disabled={item.href === "#"}
							>
								<span className="flex-1">{item.label}</span>
								{item.meta && (
									<span className="font-mono text-3xs text-text-muted mr-2">
										{item.meta}
									</span>
								)}
								{item.href !== "#" && (
									<span
										className="text-text-muted font-mono text-3xs"
										aria-hidden="true"
									>
										↵
									</span>
								)}
							</CommandSearch.Item>
						))}
					</CommandSearch.Group>
				))}
			</CommandSearch.List>
		</CommandSearch>
	)
}
