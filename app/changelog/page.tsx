import { Suspense } from "react"

import type { Metadata } from "next"

import { Container } from "@chitrank2050/monoline-ui/container"

import { DocsPager } from "../_components/docs-pager"
import JsonLd, {
	createBreadcrumbJsonLd,
	createCollectionPageJsonLd,
} from "../_components/json-ld"
import { createPageMetadata } from "../lib/metadata"
import { getCompactChangelog } from "../lib/releases"
import { routes } from "../lib/routes"
import { siteUrl } from "../lib/seo"
import { ChangelogView } from "./changelog-view"

const changelogDescription =
	"Read Monoline UI release notes for new React components, accessibility fixes, performance work, API changes, and resolved bugs across each published version."

export const metadata: Metadata = createPageMetadata({
	title: "Monoline UI React Release Changelog and Version History",
	description: changelogDescription,
	path: routes.changelog,
})

// Only show tagged releases — filter out the null-version unreleased block
const releases = getCompactChangelog()

export default function ChangelogPage() {
	const feedUrl = `${siteUrl}/changelog/feed.xml`

	return (
		<Container
			as="main"
			id="main-content"
			tabIndex={-1}
			className="pt-ml-14 pb-ml-20"
		>
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@graph": [
						createCollectionPageJsonLd({
							title: "Monoline UI release changelog",
							description: changelogDescription,
							path: routes.changelog,
							items: releases.map((release) => ({
								name: `Monoline UI ${release.version ?? "Unreleased"}`,
								path: `/changelog#release-${(
									release.version ?? "unreleased"
								).replace(/\./g, "-")}` as const,
							})),
						}),
						createBreadcrumbJsonLd([
							{ name: "Home", path: routes.home },
							{ name: "Changelog", path: routes.changelog },
						]),
					],
				}}
			/>
			<header className="docs-page__head">
				<p className="ml-eyebrow">monoline/ui</p>
				<h1>Monoline UI release changelog</h1>
				<p>
					Release notes generated from conventional commits, with links back to
					the work behind each version.
				</p>
			</header>

			<Suspense fallback={null}>
				<ChangelogView initialReleases={releases} feedUrl={feedUrl} />
			</Suspense>

			<DocsPager />
		</Container>
	)
}
