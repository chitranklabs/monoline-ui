import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"

export const metadata: Metadata = createPageMetadata({
	title: "Spacing - monoline/ui foundations",
	description:
		"Review the spacing scale tokens used across monoline/ui components.",
	path: "/foundations/spacing",
})

const spacingRows = [
	["space-1", "4px", 4, "tight inline gap"],
	["space-1-5", "6px", 6, "compact control gap"],
	["space-2", "8px", 8, "icon ↔ label inside a button"],
	["space-3", "12px", 12, "badge padding · meta row gap"],
	["space-4", "16px", 16, "small card padding · stack gap"],
	["space-6", "24px", 24, "card padding · sibling gap"],
	["space-7", "28px", 28, "compact media and panel rhythm"],
	["space-8", "32px", 32, "section internal padding"],
	["space-9", "36px", 36, "large avatar and dense hero rhythm"],
	["space-12", "48px", 48, "between content groups"],
	["space-14", "56px", 56, "navbar and compact hero height"],
	["space-16", "64px", 64, "section ↔ section on desktop"],
] as const

export default function SpacingPage() {
	return (
		<main id="main-content" tabIndex={-1} className="docs-page">
			<header className="docs-page__head">
				<p className="ml-eyebrow">Foundations · Spacing</p>
				<h1>One scale. No orphan values.</h1>
				<p>
					Spacing follows a named rem scale shared by CSS tokens, component
					aliases, and Tailwind utilities. Add new distances only when they earn
					a named token.
				</p>
			</header>

			<section className="docs-section">
				<div className="docs-subhead">
					<h2>Spacing scale</h2>
				</div>
				<div className="spacing-table">
					{spacingRows.map(([token, px, , use]) => (
						<div key={token} className="spacing-table__row">
							<span className="spacing-table__token">--{token}</span>
							<span className="spacing-table__px">{px}</span>
							<div className="spacing-table__bar">
								<div style={{ width: `var(--${token})` }} />
							</div>
							<span className="spacing-table__use">{use}</span>
						</div>
					))}
				</div>
			</section>
		</main>
	)
}
