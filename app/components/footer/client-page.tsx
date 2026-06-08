"use client"

import { Footer, type FooterSize } from "@chitrank2050/monoline-ui/footer"

import { ComponentPlayground } from "../../_components/component-playground"

const footerSizes: FooterSize[] = ["sm", "md", "lg"]

const footerColumns = [
	{
		title: "Navigate",
		links: [
			{ href: "#", label: "Projects" },
			{ href: "#", label: "Blog" },
			{ href: "#", label: "About" },
			{ href: "#", label: "Now" },
		],
	},
	{
		title: "Elsewhere",
		links: [
			{ href: "https://linkedin.com", label: "LinkedIn", external: true },
			{ href: "https://github.com", label: "GitHub", external: true },
			{ href: "https://x.com", label: "X / Twitter", external: true },
			{ href: "mailto:hello@example.com", label: "Email", external: true },
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
	["--ml-footer-link-hover-x", "External link hover offset"],
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
      { label: "LinkedIn", href: "...", external: true },
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
			description="Inspect the footer at real viewport widths, switch component size, render all sizes together, and zoom the canvas without losing the package's actual Tailwind/theme styling."
			sizes={footerSizes}
			defaultSize="md"
			importStatement='import { Footer } from "@chitrank2050/monoline-ui/footer"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(size) => (
				<Footer
					size={size}
					columns={footerColumns}
					meta="© 2026 · Built by Chitrank Agnihotri · v3.2.0"
					attribution="Next 15 · Sanity · Tailwind 4"
				/>
			)}
		/>
	)
}
