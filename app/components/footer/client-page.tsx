"use client"

import { Footer, type FooterSize } from "@chitrank2050/monoline-ui/footer"

import { ComponentPlayground } from "../../_components/component-playground"

const footerSizes: FooterSize[] = ["sm", "md", "lg"]

const footerColumns = [
	{
		title: "Navigate",
		links: [
			{ href: "/components", label: "Components" },
			{ href: "/foundations", label: "Foundations" },
			{ href: "/installation", label: "Installation" },
			{ href: "/changelog", label: "Changelog" },
		],
	},
	{
		title: "Elsewhere",
		links: [
			{
				href: "https://github.com/chitranklabs/monoline-ui",
				label: "GitHub",
				external: true,
			},
			{
				href: "https://www.npmjs.com/package/@chitrank2050/monoline-ui",
				label: "npm",
				external: true,
			},
			{
				href: "https://jsr.io/@chitrank2050/monoline-ui",
				label: "JSR",
				external: true,
			},
			{
				href: "https://chitrankagnihotri.com",
				label: "Author",
				external: true,
			},
		],
	},
]

const propsRows = [
	[
		"brand",
		"ReactNode",
		"Brand block - usually a wordmark + tagline + status pill",
	],
	[
		"columns",
		"Column[]",
		"Array of { title, links } - auto-laid into 2/3/4 cols",
	],
	[
		"subscribe",
		"ReactNode?",
		"Optional subscribe form slot - adds a 4th column",
	],
	["meta", "ReactNode?", "Left-aligned text in the bottom bar"],
	["attribution", "ReactNode?", "Right-aligned text in the bottom bar"],
] as const

const tokenRows = [
	["--ml-footer-y-sm/md/lg", "Vertical padding for each component size"],
	["--ml-footer-x-sm/md/lg", "Horizontal container padding by size"],
	["--ml-footer-layout-cols-*-desktop", "Desktop grid tracks"],
	["--ml-footer-subscribe-control-height", "Inline subscribe input height"],
	["--duration-micro", "Link and subscribe-control feedback"],
] as const

const sourceSnippet = `import { Footer } from "@chitrank2050/monoline-ui/footer"

export function SiteFooter() {
  return (
    <Footer
      size="md"
      columns={[
        { title: "Navigate", links: [
          { label: "Projects", href: "/projects" },
          { label: "Blog", href: "/blog" },
        ]},
        { title: "Elsewhere", links: [
          { label: "GitHub", href: "https://github.com", external: true },
        ]},
      ]}
      subscribe={<Footer.Subscribe />}
      meta="© 2026 · v3.2.0"
      attribution="Next 15 · Sanity · Tailwind 4"
    />
  )
}`

const usageCode = `<Footer
  brand={<Brand />}
  status={<Footer.Status>Open to work</Footer.Status>}
  columns={[
    { title: "Navigate", links: [
      { label: "Projects", href: "/projects" },
      { label: "Blog", href: "/blog" },
    ]},
    { title: "Elsewhere", links: [
      { label: "GitHub", href: "https://github.com/chitranklabs", external: true },
    ]},
  ]}
  subscribe={<Footer.Subscribe />}
  meta="© 2026 · v3.2.0"
  attribution="Next 15 · Sanity · Tailwind 4"
/>`

export default function FooterPageClient() {
	return (
		<ComponentPlayground<FooterSize>
			title="Footer"
			description="Build responsive site footers with brand copy, link columns, subscribe actions, and meta rows."
			sizes={footerSizes}
			defaultSize="md"
			importStatement='import { Footer } from "@chitrank2050/monoline-ui/footer"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			previewLayout="viewport"
			renderPreview={(size) => (
				<Footer
					size={size}
					brand="Chitrank"
					description="Technical Lead. Nine years bridging React, Node, and ML pipelines. Currently in Delhi, working on inference infra."
					status={<Footer.Status>Open to work</Footer.Status>}
					localTime="UTC+5:30 · 23:14 local"
					columns={footerColumns}
					meta="© 2026 · Built by Chitrank Agnihotri · v3.2.0"
					attribution="Next 15 · Sanity · Tailwind 4"
				/>
			)}
		/>
	)
}
