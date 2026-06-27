import type * as React from "react"

import Link from "next/link"

import { Footer } from "@chitrank2050/monoline-ui/footer"

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
		links: ["GitHub", "Discord", "X / Twitter", "Discussions", "Roadmap"],
	},
]

function SiteFooterLink(props: React.ComponentProps<typeof Link>) {
	return <Link {...props} />
}

export function SiteFooter() {
	return (
		<Footer
			brand={
				<Link href="/" className="font-mono font-extrabold tracking-[-0.045em]">
					<span>monoline</span>
					<span className="text-accent">/ui</span>
				</Link>
			}
			description="A taste-aware component library for editorial dev portfolios. Built on Tailwind v4 and CSS vars. MIT licensed."
			status={<Footer.Status>v0.2.0 · May 2026</Footer.Status>}
			columns={footerGroups.map((group) => ({
				title: group.title,
				links: group.links.map((label) => ({
					href: "#",
					label,
					external: label.includes("↗"),
				})),
			}))}
			subscribe={false}
			meta="© 2026 monoline/ui · MIT license"
			attribution="A single horizontal stroke. Hence the name."
			linkComponent={SiteFooterLink}
		/>
	)
}
