"use client"

import { BackLink } from "@chitrank2050/monoline-ui/back-link"

import { ComponentPlayground } from "../../_components/component-playground"

const usageCode = `<BackLink href="/projects">
  Back to projects
</BackLink>`

const sourceSnippet = `import { BackLink } from "@chitrank2050/monoline-ui/back-link"

export function ProjectBackLink() {
  return <BackLink href="/projects">Back to projects</BackLink>
}`

const propsRows = [
	["href", "string", "Destination for the anchor element"],
	["as", "ElementType", "Optional element or router link component"],
	["children", "ReactNode", "Visible link label"],
	["className", "string", "Additional class names"],
] as const

const tokenRows = [
	["--text-muted", "Default link text color"],
	["--accent", "Hover text and line color"],
	["--space-2", "Gap between line and label"],
	["--duration-short", "Line and color transition timing"],
] as const

export default function BackLinkPageClient() {
	return (
		<ComponentPlayground
			title="BackLink"
			description="Render a compact return link with a leading line, muted default state, and accent hover treatment."
			importStatement='import { BackLink } from "@chitrank2050/monoline-ui/back-link"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={() => (
				<div className="w-full max-w-sm p-ml-6">
					<BackLink href="/components/card">Back to components</BackLink>
				</div>
			)}
		/>
	)
}
