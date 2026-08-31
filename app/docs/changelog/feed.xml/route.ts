import { generateChangelogRss } from "@chitrank2050/monoline-ui/changelog"

import { getCompactChangelog } from "../../../lib/releases"
import { routes } from "../../../lib/routes"
import { siteUrl } from "../../../lib/seo"

export async function GET() {
	const xml = generateChangelogRss({
		title: "monoline-ui Changelog",
		description:
			"Release notes and updates for Monoline UI React component library",
		siteUrl,
		changelogPath: routes.docs.changelog,
		releases: getCompactChangelog(),
	})

	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control":
				"public, max-age=3600, s-maxage=86400, stale-while-revalidate",
		},
	})
}
