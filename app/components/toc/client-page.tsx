"use client"

import { Toc } from "@chitrank2050/monoline-ui/toc"

import { ComponentPlayground } from "../../_components/component-playground"

const usageCode = `<Toc
  items={[
    { id: "intro", label: "Introduction" },
    { id: "installation", label: "Installation" },
    { id: "usage", label: "Usage Guide" }
  ]}
/>`

const sourceSnippet = `import { Toc } from "@chitrank2050/monoline-ui/toc"

export function ArticleToc() {
  const sections = [
    { id: "overview", label: "Overview" },
    { id: "api", label: "API Reference" }
  ]
  return <Toc items={sections} heading="Article Contents" />
}`

const propsRows = [
	[
		"items",
		"TocItem[]",
		"List of ID references and labels of headings to navigate",
	],
	["activeId", "string", "Optional controlled active ID overriding observer"],
	["heading", "string", "Section title label (defaults to 'On this page')"],
	[
		"scrollOffset",
		"number",
		"Offset threshold margin for viewport scroll detection",
	],
] as const

const tokenRows = [
	["--accent", "Accent indicator border highlight on the active heading item"],
] as const

const demoItems = [
	{ id: "nav-intro", label: "Introduction to monoline-ui" },
	{ id: "nav-design", label: "Monochrome Token Aesthetics" },
	{ id: "nav-install", label: "Standard Installation Guide" },
]

export default function TocPageClient() {
	return (
		<ComponentPlayground
			title="Toc"
			description="Render document outline links with active-section tracking and optional collapsible mode."
			importStatement='import { Toc } from "@chitrank2050/monoline-ui/toc"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={() => (
				<div className="grid gap-ml-5 p-ml-6 w-full max-w-sm">
					<div className="border p-ml-4 rounded-md">
						<Toc items={demoItems} activeId="nav-design" />
					</div>
				</div>
			)}
		/>
	)
}
