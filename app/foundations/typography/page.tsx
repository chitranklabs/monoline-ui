import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Typography — monoline/ui design foundations",
	description:
		"Browse typefaces, text weights, sizes, and leading configurations defined by monoline/ui for high readability text.",
	alternates: {
		canonical: "/foundations/typography",
	},
}

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
		"The quick brown fox.",
		"docs-scale__sample--display",
	],
	["H1", "44px / 700", "The quick brown fox.", "docs-scale__sample--h1"],
	["H2", "30px / 700", "The quick brown fox.", "docs-scale__sample--h2"],
	["H3", "22px / 600", "The quick brown fox.", "docs-scale__sample--h3"],
	[
		"Body",
		"17.5px / 400",
		"The quick brown fox jumps over the lazy dog.",
		"docs-scale__sample--body",
	],
	[
		"Small",
		"13px / 400",
		"The quick brown fox jumps over the lazy dog.",
		"docs-scale__sample--small",
	],
	["Meta", "11px / 400", "MAY 12, 2026 · 9 MIN", "docs-scale__sample--meta"],
	["Eyebrow", "11px / 500", "SECTION · 02", "docs-scale__sample--eyebrow"],
] as const

export default function TypographyPage() {
	return (
		<main className="docs-page">
			<header className="docs-page__head">
				<p className="ml-eyebrow">Foundations · Typography</p>
				<h1>Three families. One job each.</h1>
				<p>
					Inter handles UI and body. IBM Plex Mono handles headlines, eyebrows,
					and code. Caveat handles the personal signature. No fourth family -
					and almost no font-weight gymnastics.
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
					<p>
						Scoped roles - no free-for-all sizing. Pick a role, not a number.
					</p>
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
