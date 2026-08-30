import { Suspense } from "react"

import type { Metadata } from "next"

import type { GitCliffRelease } from "@chitrank2050/monoline-ui/changelog"
import { Container } from "@chitrank2050/monoline-ui/container"

import { DocsPager } from "../_components/docs-pager"
import JsonLd, {
	createBreadcrumbJsonLd,
	createCollectionPageJsonLd,
} from "../_components/json-ld"
import changelogJson from "../lib/changelog.json"
import { createPageMetadata } from "../lib/metadata"
import { siteUrl } from "../lib/seo"
import { ChangelogView } from "./changelog-view"

const changelogDescription =
	"Read Monoline UI release notes for new React components, accessibility fixes, performance work, API changes, and resolved bugs across each published version."

export const metadata: Metadata = createPageMetadata({
	title: "Monoline UI React Release Changelog and Version History",
	description: changelogDescription,
	path: "/changelog",
})

// Only show tagged releases — filter out the null-version unreleased block
const releases = (changelogJson as GitCliffRelease[]).filter(
	(r) => r.version !== null
)

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
							path: "/changelog",
							items: releases.map((release) => ({
								name: `Monoline UI ${release.version ?? "Unreleased"}`,
								path: `/changelog#release-${(
									release.version ?? "unreleased"
								).replace(/\./g, "-")}` as const,
							})),
						}),
						createBreadcrumbJsonLd([
							{ name: "Home", path: "/" },
							{ name: "Changelog", path: "/changelog" },
						]),
					],
				}}
			/>
			<header className="docs-page__head">
				<p className="ml-eyebrow">monoline/ui</p>
				<h1>Monoline UI release changelog</h1>
				<p>
					Every feature, fix, and improvement shipped to the component library,
					generated from conventional commits.
				</p>
			</header>

			<Suspense fallback={null}>
				<ChangelogView initialReleases={releases} feedUrl={feedUrl} />
			</Suspense>

			<DocsPager />
		</Container>
	)
}
