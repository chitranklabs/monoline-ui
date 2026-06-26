import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"

export const metadata: Metadata = createPageMetadata({
	title: "Motion - monoline/ui foundations",
	description:
		"Review the motion and duration tokens used across monoline/ui components.",
	path: "/foundations/motion",
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
			<header className="docs-page__head">
				<p className="ml-eyebrow">Foundations · Motion</p>
				<h1>Four durations, two easings.</h1>
				<p>
					Use named tokens instead of raw ms values in components. Reduced
					motion is handled automatically.
				</p>
			</header>

			<section className="docs-section">
				<div className="docs-subhead">
					<h2>Duration</h2>
					<p>
						Four durations, two easings. Use named tokens instead of raw ms in
						components.
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
