import type { Metadata } from "next"

import { DocsArticleJsonLd } from "../../../_components/docs-article-json-ld"
import { createPageMetadata } from "../../../lib/metadata"

const displayTitle = "Radius"
const pageDescription =
	"Monoline UI defines border-radius tokens for React interfaces, with clear roles for controls, cards, callouts, status pills, and nested component surfaces."

export const metadata: Metadata = createPageMetadata({
	title: "Border Radius Design Tokens | monoline/ui Documentation",
	description: pageDescription,
	path: "/docs/foundations/radius",
})

const radii = [
	["radius-xs", "4px", "kbd, code tag", 4],
	["radius-sm", "6px", "button, input", 6],
	["radius-md", "8px", "callout, toast", 8],
	["radius-lg", "12px", "card", 12],
	["radius-xl", "16px", "feature card", 16],
] as const

export default function RadiusPage() {
	return (
		<main id="main-content" tabIndex={-1} className="docs-page">
			<DocsArticleJsonLd
				title={displayTitle}
				description={pageDescription}
				path="/foundations/radius"
				section="Foundations"
				sectionPath="/foundations"
			/>
			<header className="docs-page__head">
				<p className="ml-eyebrow">Foundations · Radius</p>
				<h1>{displayTitle}</h1>
				<p>
					Five tokens cover controls, cards, and fully rounded status pills.
					Choose by role instead of assigning one radius to every surface.
				</p>
			</header>

			<section className="docs-section">
				<div className="docs-subhead">
					<h2>Border radius</h2>
					<p>Compare the scale and the element each token is meant to shape.</p>
				</div>
				<div className="radius-grid">
					{radii.map(([token, px, use]) => (
						<article key={token} className="radius-card">
							<div style={{ borderRadius: `var(--${token})` }} />
							<h3 className="pt-3">--{token}</h3>
							<p>
								{px} · {use}
							</p>
						</article>
					))}
				</div>
			</section>
		</main>
	)
}
