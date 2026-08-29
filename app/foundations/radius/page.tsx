import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"

export const metadata: Metadata = createPageMetadata({
	title: "Border Radius Design Tokens | monoline/ui Documentation",
	description:
		"Explore the monoline/ui border radius tokens for React interfaces, including the available scale, semantic usage guidance, and consistent component surfaces.",
	path: "/foundations/radius",
})

const radii = [
	["radius-xs", "4px", "kbd, code chip", 4],
	["radius-sm", "6px", "button, input", 6],
	["radius-md", "8px", "callout, toast", 8],
	["radius-lg", "12px", "card", 12],
	["radius-xl", "16px", "feature card", 16],
] as const

export default function RadiusPage() {
	return (
		<main id="main-content" tabIndex={-1} className="docs-page">
			<header className="docs-page__head">
				<p className="ml-eyebrow">Foundations · Radius</p>
				<h1>Match the curve to the element.</h1>
				<p>
					Five named radii from sharp to friendly. Buttons stay smaller, cards
					go larger, status pills are fully rounded with{" "}
					<code>--radius-pill</code>.
				</p>
			</header>

			<section className="docs-section">
				<div className="docs-subhead">
					<h2>Border radius</h2>
					<p>
						Match the radius to the element: buttons stay smaller, cards go
						larger, status pills are fully rounded.
					</p>
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
