"use client"

import { Toc } from "@chitrank2050/monoline-ui/toc"

import { ComponentPlayground } from "../../../_components/component-playground"

const usageCode = `import { Toc } from "@chitrank2050/monoline-ui/toc"

// 1. Default Numbered Editorial Variant
<Toc
  items={[
    { id: "intro", label: "Introduction to Monoline" },
    { id: "tokens", label: "OKLCH Color Tokens", depth: 2 },
    { id: "themes", label: "Light & Dark Modes", depth: 3 },
    { id: "install", label: "Installation Guide", depth: 2 }
  ]}
  variant="default"
  heading="On this page"
/>

// 2. Compact Minimalist Variant (Tree with indentation)
<Toc
  items={[
    { id: "intro", label: "Introduction" },
    { id: "usage", label: "Usage", depth: 2 },
    { id: "import", label: "Import syntax", depth: 3 },
    { id: "props", label: "Props reference", depth: 2 }
  ]}
  variant="compact"
  heading="Table of Contents"
/>

// 3. Collapsible Mode
<Toc
  items={items}
  collapsible
  defaultOpen
  heading="Contents · 4 sections"
/>`

const sourceSnippet = `import { Toc } from "@chitrank2050/monoline-ui/toc"

export function ArticleSidebar() {
  const sections = [
    { id: "overview", label: "Architecture Overview" },
    { id: "token-system", label: "Token System & Scales", depth: 2 },
    { id: "color-primitives", label: "OKLCH Primitives", depth: 3 },
    { id: "motion-physics", label: "Spring Motion Physics", depth: 3 },
    { id: "accessibility", label: "Accessibility notes", depth: 2 }
  ]

  return (
    <aside className="w-64">
      <Toc
        items={sections}
        variant="default"
        heading="On This Page"
        scrollOffset={100}
      />
    </aside>
  )
}`

const propsRows = [
	[
		"items",
		"TocItem[]",
		"List of heading items ({ id, label, depth? }) to track and navigate",
	],
	[
		"variant",
		'"default" | "compact"',
		'"default" renders numbered 01/02 mono indices with left accent bar; "compact" renders clean indented text links',
	],
	[
		"activeId",
		"string",
		"Optional controlled active ID overriding the viewport intersection observer",
	],
	[
		"heading",
		"ReactNode",
		"Section header label (e.g. 'On this page' or 'Table of Contents')",
	],
	[
		"collapsible",
		"boolean",
		"Wraps the table of contents inside an expandable disclosure card with chevron toggle",
	],
	[
		"defaultOpen",
		"boolean",
		"Initial expansion state when collapsible is enabled (defaults to false)",
	],
	[
		"scrollOffset",
		"number",
		"Top margin offset in pixels for intersection observer detection (defaults to 80)",
	],
] as const

const tokenRows = [
	[
		"--accent",
		"Accent color applied to the active indicator bar and active step number",
	],
	[
		"--text-muted",
		"Muted color for inactive step numbers and nested tertiary items",
	],
	["--text-secondary", "Default color for inactive heading link labels"],
	["--text", "Primary foreground color for hovered and active items"],
] as const

const defaultDemoItems = [
	{ id: "nav-intro", label: "Introduction to Monoline UI" },
	{ id: "nav-design", label: "Monochrome Token Aesthetics" },
	{ id: "nav-install", label: "Standard Installation Guide" },
	{ id: "nav-primitives", label: "Slot-driven Primitives" },
]

const nestedDemoItems = [
	{ id: "doc-usage", label: "Usage", depth: 2 },
	{ id: "doc-import", label: "Import Statement", depth: 3 },
	{ id: "doc-basic", label: "Basic Configuration", depth: 3 },
	{ id: "doc-props", label: "API Reference", depth: 2 },
	{ id: "doc-tokens", label: "Design Tokens", depth: 2 },
	{ id: "doc-related", label: "Related Guides", depth: 2 },
]

export default function TocPageClient() {
	return (
		<ComponentPlayground
			title="Toc"
			description="Render document outline links with active-section tracking, depth hierarchy, numbered editorial styling, or compact tree mode."
			importStatement='import { Toc } from "@chitrank2050/monoline-ui/toc"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={() => (
				<div className="grid grid-cols-1 gap-ml-6 p-ml-6 w-full max-w-4xl items-start md:grid-cols-3">
					{/* Variant 1: Default (Numbered Editorial) */}
					<div className="flex flex-col gap-ml-3">
						<div className="flex items-center justify-between">
							<span className="font-mono text-3xs font-semibold uppercase tracking-eyebrow text-accent">
								Default Variant
							</span>
							<span className="font-mono text-3xs text-text-muted">
								Numbered
							</span>
						</div>
						<Toc
							items={defaultDemoItems}
							activeId="nav-design"
							variant="default"
							heading="On this page"
						/>
					</div>

					{/* Variant 2: Compact (Minimalist Tree) */}
					<div className="flex flex-col gap-ml-3">
						<div className="flex items-center justify-between">
							<span className="font-mono text-3xs font-semibold uppercase tracking-eyebrow text-accent">
								Compact Variant
							</span>
							<span className="font-mono text-3xs text-text-muted">
								Nested Tree
							</span>
						</div>
						<Toc
							items={nestedDemoItems}
							activeId="doc-basic"
							variant="compact"
							heading="On this page"
						/>
					</div>

					{/* Variant 3: Collapsible Mode */}
					<div className="flex flex-col gap-ml-3">
						<div className="flex items-center justify-between">
							<span className="font-mono text-3xs font-semibold uppercase tracking-eyebrow text-accent">
								Collapsible Mode
							</span>
							<span className="font-mono text-3xs text-text-muted">
								Expandable
							</span>
						</div>
						<Toc
							items={defaultDemoItems}
							activeId="nav-intro"
							collapsible
							defaultOpen
							heading="Contents · 4 sections"
						/>
					</div>
				</div>
			)}
		/>
	)
}
