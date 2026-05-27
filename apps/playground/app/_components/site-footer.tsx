import Link from "next/link"

const footerGroups = [
	{
		title: "Docs",
		links: [
			"Introduction",
			"Installation",
			"Theming",
			"Migration",
			"Changelog",
		],
	},
	{
		title: "Resources",
		links: [
			"Components",
			"Foundations",
			"Figma library",
			"Templates",
			"Examples",
		],
	},
	{
		title: "Community",
		links: [
			"GitHub ↗",
			"Discord ↗",
			"X / Twitter ↗",
			"Discussions ↗",
			"Roadmap ↗",
		],
	},
]

export function SiteFooter() {
	return (
		<footer className="site-footer">
			<div className="site-footer__inner">
				<div className="site-footer__top">
					<div className="site-footer__brand">
						<Link href="/" className="site-wordmark">
							<span>monoline</span>
							<span className="text-accent">/ui</span>
						</Link>
						<p>
							A taste-aware component library for editorial dev portfolios.
							Built on Tailwind v4 and CSS vars. MIT licensed.
						</p>
						<div className="site-footer__badges">
							<span>
								<i />
								v0.2.0 · May 2026
							</span>
							<span>★ 1,247</span>
						</div>
					</div>

					{footerGroups.map((group) => (
						<nav key={group.title} className="site-footer__group">
							<h2>{group.title}</h2>
							{group.links.map((link) => (
								<a key={link} href="#">
									{link}
								</a>
							))}
						</nav>
					))}
				</div>

				<div className="site-footer__bottom">
					<p>© 2026 monoline/ui · MIT licence</p>
					<p>A single horizontal stroke. Hence the name.</p>
				</div>
			</div>
		</footer>
	)
}
