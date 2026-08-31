"use client"

import {
	ResourcesPanel,
	type ResourcesPanelSize,
} from "@chitrank2050/monoline-ui/resources-panel"

import { ComponentPlayground } from "../../../_components/component-playground"

const resourcesPanelSizes: ResourcesPanelSize[] = ["sm", "md", "lg"]

const items = [
	{
		kind: "live",
		label: "Live app",
		href: "https://monolineui.chitrankagnihotri.com",
		host: "monolineui.chitrankagnihotri.com",
		primary: true,
	},
	{
		kind: "source",
		label: "Source code",
		href: "https://github.com/chitranklabs/monoline-ui",
		host: "github.com/chitranklabs/monoline-ui",
	},
	{
		kind: "npm",
		label: "NPM package",
		href: "https://www.npmjs.com/package/@chitrank2050/monoline-ui",
		host: "@chitrank2050/monoline-ui",
		badge: "npm",
	},
	{
		kind: "jsr",
		label: "JSR package",
		href: "https://jsr.io/@chitrank2050/monoline-ui",
		host: "@chitrank2050/monoline-ui",
		badge: "JSR",
	},
	{
		kind: "docs",
		label: "Documentation",
		href: "https://monolineui.chitrankagnihotri.com/docs/components",
		host: "monolineui.chitrankagnihotri.com/docs/components",
	},
	{
		kind: "changelog",
		label: "Changelog",
		href: "https://monolineui.chitrankagnihotri.com/changelog",
		host: "monolineui.chitrankagnihotri.com/changelog",
		badge: "New",
	},
	{
		kind: "figma",
		label: "Design foundations",
		href: "https://monolineui.chitrankagnihotri.com/docs/foundations",
		host: "monolineui.chitrankagnihotri.com/docs/foundations",
	},
	{
		kind: "video",
		label: "Release notes",
		href: "https://github.com/chitranklabs/monoline-ui/releases",
		host: "github.com/chitranklabs/monoline-ui/releases",
	},
	{
		kind: "paper",
		label: "Contribution guide",
		href: "https://github.com/chitranklabs/monoline-ui/blob/main/CONTRIBUTING.md",
		host: "CONTRIBUTING.md",
		meta: "GitHub",
	},
] as const

const propsRows = [
	["size", "sm | md | lg", "Panel density and row scale"],
	["title", "string", "Exact header label (defaults to Resources)"],
	["meta", "ReactNode", "Right-aligned header metadata"],
	["items", "ResourcesPanelItem[]", "Dynamic resource rows"],
	["footer", "ReactNode | null", "Footer override; null hides the footer"],
	["footerLabel", "ReactNode", "Custom footer text when footer is not set"],
	["linkComponent", "ComponentType", "Next Link or router link adapter"],
] as const

const tokenRows = [
	["--ml-resources-panel-padding-x", "Inline row and header padding"],
	["--ml-resources-panel-icon-size", "Resource icon box size"],
	["--ml-resources-panel-label-text", "Row label type scale"],
	["--ml-resources-panel-host-text", "Row host metadata type scale"],
	["--border", "Panel and row separators"],
] as const

const sourceSnippet = `import { ResourcesPanel } from "@chitrank2050/monoline-ui/resources-panel"

export function ProjectResources({ resources }) {
  return (
	    <ResourcesPanel
	      meta="v2.4.1 · MIT"
	      title={\`Resources · \${resources.length}\`}
	      items={resources}
	      footerLabel="8 total resources"
	    />
  )
}`

const usageCode = `<ResourcesPanel
  meta="v2.4.1 · MIT"
  title="Resources · 8"
  items={[
    {
      kind: "live",
      label: "Live app",
      href: "https://monolineui.io",
      host: "monolineui.io",
      primary: true,
    },
    {
      kind: "source",
      label: "Source code",
      href: "https://github.com/monoline/insights",
      host: "github.com/monoline/insights",
    },
  ]}
/>

<ResourcesPanel title="Links" items={resources} footer={null} />`

export default function ResourcesPanelPageClient() {
	return (
		<ComponentPlayground<ResourcesPanelSize>
			title="ResourcesPanel"
			description="List project resources such as live links, source, docs, files, and videos in a compact sidebar."
			sizes={resourcesPanelSizes}
			defaultSize="md"
			importStatement='import { ResourcesPanel } from "@chitrank2050/monoline-ui/resources-panel"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(size = "md") => (
				<div className="w-full max-w-sm p-ml-6">
					<ResourcesPanel
						size={size}
						title="Resources · 8"
						meta="v2.4.1 · MIT"
						items={[...items]}
					/>
				</div>
			)}
		/>
	)
}
