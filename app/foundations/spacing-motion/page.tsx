import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Spacing & Motion — monoline/ui design foundations",
	description:
		"Understand spacing ladders, border radius tokens, and spring animation timings used for transitions in monoline/ui components.",
	openGraph: {
		title: "Spacing & Motion — monoline/ui design foundations",
		description:
			"Understand spacing ladders, border radius tokens, and spring animation timings used for transitions in monoline/ui components.",
	},
	twitter: {
		title: "Spacing & Motion — monoline/ui design foundations",
		description:
			"Understand spacing ladders, border radius tokens, and spring animation timings used for transitions in monoline/ui components.",
	},
	alternates: {
		canonical: "/foundations/spacing-motion",
	},
}

const spacingRows = [
	["space-1", "4px", 4, "tight inline gap"],
	["space-2", "8px", 8, "icon ↔ label inside a button"],
	["space-3", "12px", 12, "badge padding · meta row gap"],
	["space-4", "16px", 16, "small card padding · stack gap"],
	["space-6", "24px", 24, "card padding · sibling gap"],
	["space-8", "32px", 32, "section internal padding"],
	["space-12", "48px", 48, "between content groups"],
	["space-16", "64px", 64, "section ↔ section on desktop"],
] as const

const radii = [
	["radius-xs", "4px", "kbd, code chip", 4],
	["radius-sm", "6px", "button, input", 6],
	["radius-md", "8px", "callout, toast", 8],
	["radius-lg", "12px", "card", 12],
	["radius-xl", "16px", "feature card", 16],
] as const

const motion = [
	["duration-micro", "120ms", "button bg, focus ring, tag hover"],
	["duration-short", "250ms", "card lift, image zoom"],
	["duration-medium", "450ms", "heart pop, toggle spring"],
	["duration-long", "700ms", "page entry, scrubber"],
] as const

export default function SpacingMotionPage() {
	return (
		<main className="docs-page">
			<header className="docs-page__head">
				<p className="ml-eyebrow">Foundations · Spacing</p>
				<h1>Eight steps. No half-measures.</h1>
				<p>
					Spacing follows a tight 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 scale.
					Reach outside the scale and you usually mean to fix a layout, not
					invent a new size.
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

			<section className="docs-section">
				<div className="docs-subhead">
					<h2>Border radius</h2>
					<p>
						Match the radius to the element - buttons stay smaller, cards go
						larger, status pills are fully rounded.
					</p>
				</div>
				<div className="radius-grid">
					{radii.map(([token, px, use]) => (
						<article key={token} className="radius-card">
							<div style={{ borderRadius: `var(--${token})` }} />
							<h3>--{token}</h3>
							<p>
								{px} · {use}
							</p>
						</article>
					))}
				</div>
			</section>

			<section className="docs-section" id="motion">
				<div className="docs-subhead">
					<h2>Motion</h2>
					<p>
						Four durations, two easings. Use named tokens - never pick raw ms in
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
