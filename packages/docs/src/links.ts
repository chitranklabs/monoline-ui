import { dirname, resolve } from "node:path"

import type { DocumentationPage } from "./content.ts"

/** Resolve author links against discovered pages, before any output is published. */
export function createPageLinks(
	pages: DocumentationPage[],
	content: string,
	base: string,
	assetUrl: (link: string) => string
) {
	const byRoute = new Map(pages.map((page) => [page.route as string, page]))
	const byFile = new Map(pages.map((page) => [resolve(page.filePath), page]))
	const references: Array<{ from: string; route: string; hash: string }> = []
	return {
		references,
		resolve(page: DocumentationPage, link: string): string {
			if (/^(?:https?:|mailto:|tel:|\/\/)/i.test(link)) return link
			if (link.startsWith("/assets/")) return assetUrl(link)
			const url = new URL(
				link,
				`https://docs.invalid${page.route === "/" ? "/" : page.route + "/"}`
			)
			const path = decodeURIComponent(url.pathname)
			let target
			if (/\.mdx?$/.test(path)) {
				const sourcePath = decodeURIComponent(link.split(/[?#]/)[0]!)
				target = byFile.get(
					resolve(
						sourcePath.startsWith("/") ? content : dirname(page.filePath),
						sourcePath.replace(/^\//, "")
					)
				)
			} else target = byRoute.get(path.replace(/\/$/, "") || "/")
			if (!target)
				throw new Error(`${page.filePath}: broken internal link "${link}"`)
			references.push({
				from: page.filePath,
				route: target.route,
				hash: decodeURIComponent(url.hash.slice(1)),
			})
			return (
				base +
				(target.route === "/" ? "" : target.route.slice(1) + "/") +
				url.search +
				url.hash
			)
		},
	}
}
