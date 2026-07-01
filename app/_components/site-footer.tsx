import type * as React from "react"

import Link from "next/link"

import { Footer } from "@chitrank2050/monoline-ui/footer"

import { getLatestRelease } from "../lib/releases"

const footerGroups = [
	{
		title: "Docs",
		links: [
			{
				title: "Installation",
				href: "/installation",
			},
			{
				title: "Changelog",
				href: "https://github.com/chitranklabs/monoline-ui/blob/main/CHANGELOG.md",
				external: true,
			},
		],
	},
	{
		title: "Resources",
		links: [
			{
				title: "Foundations",
				href: "/foundations/color",
			},
			{
				title: "Components",
				href: "/components/card",
			},
		],
	},
	{
		title: "Community",
		links: [
			{
				title: "GitHub",
				href: "https://github.com/chitranklabs/monoline-ui",
				external: true,
			},
			{
				title: "Discussions",
				href: "https://github.com/chitranklabs/monoline-ui/discussions",
				external: true,
			},
		],
	},
]

function SiteFooterLink(props: React.ComponentProps<typeof Link>) {
	return <Link {...props} />
}

export async function SiteFooter() {
	const release = await getLatestRelease()

	return (
		<Footer
			brand={
				<Link href="/" className="font-mono font-extrabold tracking-[-0.045em]">
					<span>monoline</span>
					<span className="text-accent">/ui</span>
				</Link>
			}
			description="A taste-aware component library for editorial dev portfolios. Built on Tailwind v4 and CSS vars. MIT licensed."
			status={
				<Footer.Status>
					{release.version} · <span className="capitalize">{release.date}</span>
				</Footer.Status>
			}
			columns={footerGroups.map((group) => ({
				title: group.title,
				links: group.links.map((link) => ({
					href: link.href,
					label: link.title,
					external: link.external,
				})),
			}))}
			subscribe={false}
			meta={`© ${new Date().getFullYear()} monoline/ui · MIT license`}
			attribution="A single horizontal stroke. Hence the name."
			linkComponent={SiteFooterLink}
		/>
	)
}
