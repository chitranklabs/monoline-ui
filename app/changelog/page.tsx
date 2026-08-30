import type { Metadata } from "next"

import { ChangelogTimeline } from "@chitrank2050/monoline-ui/changelog"
import type { GitCliffRelease } from "@chitrank2050/monoline-ui/changelog"
import { Container } from "@chitrank2050/monoline-ui/container"

import { DocsPager } from "../_components/docs-pager"
import JsonLd, {
	createBreadcrumbJsonLd,
	createCollectionPageJsonLd,
} from "../_components/json-ld"
import changelogJson from "../lib/changelog.json"
import { createPageMetadata } from "../lib/metadata"
import { ChangelogToc } from "./toc"

const changelogDescription =
	"Follow every Monoline UI release, feature, accessibility improvement, performance change, and bug fix in the complete React component library version history."

export const metadata: Metadata = createPageMetadata({
	title: "Full Monoline UI Release Changelog and Version History",
	description: changelogDescription,
	path: "/changelog",
})

// Only show tagged releases — filter out the null-version unreleased block
const releases = (changelogJson as GitCliffRelease[]).filter(
	(r) => r.version !== null
)
const tocItems = releases.map((release) => {
	const version = release.version ?? "Unreleased"
	return {
		id: `release-${version.replace(/\./g, "-")}`,
		label: version,
	}
})

export default function ChangelogPage() {
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
								path: "/changelog" as const,
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

			{/* Two-column layout: sticky TOC left, timeline right */}
			<div className="changelog-layout">
				{/* Sticky TOC sidebar */}
				<aside className="changelog-layout__toc">
					<div className="changelog-layout__toc-inner">
						<ChangelogToc items={tocItems} />
					</div>
				</aside>

				{/* Main timeline */}
				<section className="changelog-layout__content">
					<h2 className="sr-only">Release history</h2>
					<ChangelogTimeline
						releases={releases}
						githubOwner="chitranklabs"
						githubRepo="monoline-ui"
						allowedGroups={[
							"Features",
							"Bug Fixes",
							"Performance",
							"Documentation",
						]}
					/>
				</section>
			</div>

			<DocsPager />
		</Container>
	)
}
