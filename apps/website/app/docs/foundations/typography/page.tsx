import type { Metadata } from "next"

import { DocsArticleJsonLd } from "../../../_components/docs-article-json-ld"
import { createPageMetadata } from "../../../lib/metadata"
import { routes } from "../../../lib/routes"

const displayTitle = "Typography"
const pageDescription =
	"Monoline UI defines typography tokens for font roles, type scales, weights, line heights, metadata, labels, and editorial React interface content and code."

export const metadata: Metadata = createPageMetadata({
	title: "Typography Design Tokens | monoline/ui Documentation",
	description: pageDescription,
	path: routes.docs.foundations.typography,
})

const families = [
	[
		"Inter",
		"Body & UI",
		"Aa",
		"font-sans",
		"--font-sans",
		"300 · 400 · 500 · 600 · 700",
	],
	[
		"IBM Plex Mono",
		"Headlines · Code",
		"Aa",
		"font-mono",
		"--font-mono",
		"400 · 500 · 600 · 700",
	],
	[
		"Caveat",
		"Signature",
		"Aa",
		"font-script",
		"--font-script",
		"500 · 600 · 700",
	],
] as const

const scaleRows = [
	[
		"Display",
		"64px / 700",
		"Design systems need rhythm.",
		"docs-scale__sample--display",
	],
	["H1", "44px / 700", "Build clear interfaces.", "docs-scale__sample--h1"],
	["H2", "30px / 700", "Document the pattern.", "docs-scale__sample--h2"],
	["H3", "22px / 600", "Name the decision.", "docs-scale__sample--h3"],
	[
		"Body",
		"18px / 400",
		"Body copy should explain the tradeoff without slowing the reader down.",
		"docs-scale__sample--body",
	],
	[
		"Small",
		"14px / 400",
		"Small text supports controls, captions, and compact notes.",
		"docs-scale__sample--small",
	],
	["Meta", "11px / 400", "MAY 12, 2026 · 9 MIN", "docs-scale__sample--meta"],
	["Eyebrow", "11px / 500", "SECTION · 02", "docs-scale__sample--eyebrow"],
] as const

export default function TypographyPage() {
	return (
		<main id="main-content" tabIndex={-1} className="docs-page">
			<DocsArticleJsonLd
				title={displayTitle}
				description={pageDescription}
				path={routes.docs.foundations.typography}
				section="Foundations"
				sectionPath={routes.docs.foundations.root}
			/>
			<header className="docs-page__head">
				<p className="ml-eyebrow">Foundations · Typography</p>
				<h1>{displayTitle}</h1>
				<p>
					Inter handles UI and body. IBM Plex Mono handles headlines, eyebrows,
					and code. Caveat handles the personal signature. Keep the roles clear
					and avoid adding extra families.
				</p>
			</header>

			<section className="docs-section">
				<div className="docs-subhead">
					<h2>Families</h2>
				</div>
				<div className="family-grid">
					{families.map(([family, role, sample, className, token, weights]) => (
						<article key={family} className="family-card">
							<div className={`family-card__sample ${className}`}>{sample}</div>
							<div>
								<h3>{family}</h3>
								<p>{role}</p>
								<code>{token}</code>
								<small>{weights}</small>
							</div>
						</article>
					))}
				</div>
			</section>

			<section className="docs-section">
				<div className="docs-subhead">
					<h2>Scale</h2>
					<p>Use role-based sizes for headings, body, metadata, and labels.</p>
				</div>
				<div className="docs-scale">
					{scaleRows.map(([role, spec, sample, className]) => (
						<div key={role} className="docs-scale__row">
							<span className="docs-scale__role">{role}</span>
							<span className="docs-scale__spec">{spec}</span>
							<span className={`docs-scale__sample ${className}`}>
								{sample}
							</span>
						</div>
					))}
				</div>
			</section>
		</main>
	)
}
