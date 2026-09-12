import type { DocumentationPage } from "./content"

export type NavigationItem =
	| { label: string; href: `/${string}` }
	| { label: string; items: NavigationItem[] }

export interface ResolvedNavigation {
	items: NavigationItem[]
	sequence: Array<{ label: string; href: `/${string}` }>
}

function isLink(
	item: NavigationItem
): item is { label: string; href: `/${string}` } {
	return "href" in item
}

export function buildNavigation(
	pages: DocumentationPage[],
	configuredItems?: NavigationItem[]
): ResolvedNavigation {
	const pagesByRoute = new Map(pages.map((page) => [page.route, page]))
	const items =
		configuredItems ??
		[...pages]
			.sort(
				(left, right) =>
					(left.metadata.order ?? Number.POSITIVE_INFINITY) -
						(right.metadata.order ?? Number.POSITIVE_INFINITY) ||
					left.route.localeCompare(right.route)
			)
			.map((page) => ({ label: page.metadata.title, href: page.route }))
	const sequence: ResolvedNavigation["sequence"] = []
	const seenRoutes = new Set<string>()

	function visit(navigationItems: NavigationItem[]): void {
		for (const item of navigationItems) {
			if (!isLink(item)) {
				visit(item.items)
				continue
			}

			if (!pagesByRoute.has(item.href)) {
				throw new Error(
					`Unknown documentation route "${item.href}" in navigation`
				)
			}
			if (seenRoutes.has(item.href)) {
				throw new Error(
					`Duplicate documentation route "${item.href}" in navigation`
				)
			}

			seenRoutes.add(item.href)
			sequence.push(item)
		}
	}

	visit(items)
	return { items, sequence }
}
