import type { Metadata } from "next"

import { ChangelogTimeline } from "@chitrank2050/monoline-ui/changelog"
import type { GitCliffRelease } from "@chitrank2050/monoline-ui/changelog"
import { Container } from "@chitrank2050/monoline-ui/container"

import { DocsPager } from "../_components/docs-pager"
import changelogJson from "../lib/changelog.json"
import { createPageMetadata } from "../lib/metadata"
import { ChangelogToc } from "./toc"

export const metadata: Metadata = createPageMetadata({
	title: "Changelog | monoline/ui",
	description:
		"Release history for monoline/ui — every feature, fix, and improvement shipped to the component library.",
	path: "/changelog",
})

// Only show tagged releases — filter out the null-version unreleased block
const releases = (changelogJson as GitCliffRelease[]).filter(
	(r) => r.version !== null
)

export default function ChangelogPage() {
	return (
		<Container
			as="main"
			id="main-content"
			tabIndex={-1}
			className="pt-ml-14 pb-ml-20"
		>
			<header className="docs-page__head">
				<p className="ml-eyebrow">monoline/ui</p>
				<h1>Changelog</h1>
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
						<ChangelogToc releases={releases} />
					</div>
				</aside>

				{/* Main timeline */}
				<div className="changelog-layout__content">
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
				</div>
			</div>

			<DocsPager />
		</Container>
	)
}
