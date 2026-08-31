import type { Metadata } from "next"

import { DocsArticleJsonLd } from "../../../_components/docs-article-json-ld"
import { createPageMetadata } from "../../../lib/metadata"

const displayTitle = "Motion"
const pageDescription =
	"Monoline UI provides motion and duration tokens for React interfaces, with short feedback timings, shared easing curves, and automatic reduced-motion behavior."

export const metadata: Metadata = createPageMetadata({
	title: "Motion and Duration Design Tokens | monoline/ui Docs",
	description: pageDescription,
	path: "/docs/foundations/motion",
})

const motion = [
	["duration-micro", "100ms", "button, focus, and tag feedback"],
	["duration-short", "180ms", "indicators, toggles, and image color"],
	["duration-medium", "240ms", "sheets and larger surfaces"],
	["duration-long", "360ms", "deliberate entry motion"],
] as const

export default function MotionPage() {
	return (
		<main id="main-content" tabIndex={-1} className="docs-page">
			<DocsArticleJsonLd
				title={displayTitle}
				description={pageDescription}
				path="/foundations/motion"
				section="Foundations"
				sectionPath="/foundations"
			/>
			<header className="docs-page__head">
				<p className="ml-eyebrow">Foundations · Motion</p>
				<h1>{displayTitle}</h1>
				<p>
					Shared timings keep feedback quick and consistent. The theme removes
					nonessential movement when the user prefers reduced motion.
				</p>
			</header>

			<section className="docs-section">
				<div className="docs-subhead">
					<h2>Duration</h2>
					<p>
						Choose the shortest duration that still makes a state change clear.
					</p>
				</div>
				<div className="motion-grid">
					{motion.map(([token, value, use]) => (
						<article key={token} className="motion-card">
							<div className="motion-card__head">
								<h3>--{token}</h3>
								<span>{value}</span>
							</div>
							<p>{use}</p>
						</article>
					))}
				</div>
			</section>
		</main>
	)
}
