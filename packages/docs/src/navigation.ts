import type { DocumentationPage } from "./content.ts"

interface NavigationLabel {
	label: string
	icon?: string
	badge?: string
	order?: number
}
export type NavigationItem = NavigationLabel &
	(
		| { href: `/${string}` }
		| {
				items: NavigationItem[]
				expanded?: boolean
				style?: "collapsible" | "plain"
		  }
	)
export interface NavigationSection extends NavigationLabel {
	href: `/${string}`
	items: NavigationItem[]
}
export type NavigationConfig =
	NavigationItem[] | { sections: NavigationSection[] }
export interface ResolvedNavigation {
	items: NavigationItem[]
	sequence: Array<NavigationLabel & { href: `/${string}` }>
	sections: Array<
		NavigationSection & { sequence: ResolvedNavigation["sequence"] }
	>
	sectionByRoute: Record<string, number>
}

export function buildNavigation(
	pages: DocumentationPage[],
	configured?: NavigationConfig
): ResolvedNavigation {
	const routes = new Set(pages.map((page) => page.route))
	const seen = new Set<string>()
	const ordered = <T extends NavigationLabel>(items: T[]): T[] =>
		[...items].sort(
			(a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || 0
		)
	function resolve(input: NavigationItem[]) {
		const sequence: ResolvedNavigation["sequence"] = []
		function visit(input: NavigationItem[]): NavigationItem[] {
			return ordered(input).map((item) => {
				if ("items" in item) return { ...item, items: visit(item.items) }
				if (!routes.has(item.href))
					throw new Error(
						`Unknown documentation route "${item.href}" in navigation`
					)
				if (seen.has(item.href))
					throw new Error(
						`Duplicate documentation route "${item.href}" in navigation`
					)
				seen.add(item.href)
				sequence.push(item)
				return { ...item }
			})
		}
		return { items: visit(input), sequence }
	}
	const sections: ResolvedNavigation["sections"] = []
	const sectionByRoute: Record<string, number> = {}
	if (configured && !Array.isArray(configured)) {
		for (const section of ordered(configured.sections)) {
			const resolved = resolve(section.items)
			if (!resolved.sequence.some((item) => item.href === section.href))
				throw new Error(
					`Invalid section landing route "${section.href}" in navigation`
				)
			for (const item of resolved.sequence)
				sectionByRoute[item.href] = sections.length
			sections.push({ ...section, ...resolved })
		}
		return {
			items: sections.flatMap((section) => section.items),
			sequence: sections.flatMap((section) => section.sequence),
			sections,
			sectionByRoute,
		}
	}
	const defaults = [...pages]
		.sort(
			(a, b) =>
				(a.metadata.order ?? Infinity) - (b.metadata.order ?? Infinity) ||
				a.route.localeCompare(b.route)
		)
		.map((page) => ({
			label: page.metadata.navTitle ?? page.metadata.title,
			href: page.route,
		}))
	return { ...resolve(configured ?? defaults), sections, sectionByRoute }
}
