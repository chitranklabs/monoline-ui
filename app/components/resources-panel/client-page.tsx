"use client"

import {
	ResourcesPanel,
	type ResourcesPanelSize,
} from "@chitrank2050/monoline-ui/resources-panel"

import { ComponentPlayground } from "../../_components/component-playground"

const resourcesPanelSizes: ResourcesPanelSize[] = ["sm", "md", "lg"]

const items = [
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
	{
		kind: "npm",
		label: "NPM package",
		href: "https://npmjs.com/package/@monoline/sdk",
		host: "@monoline/sdk",
		badge: "v2.4.1",
	},
	{
		kind: "docs",
		label: "Documentation",
		href: "https://docs.monolineui.io",
		host: "docs.monolineui.io",
	},
	{
		kind: "changelog",
		label: "Changelog",
		href: "https://changelog.monolineui.io",
		host: "changelog.monolineui.io",
		badge: "New",
	},
	{
		kind: "figma",
		label: "Design files",
		href: "https://figma.com",
		host: "figma.com/file/monoline-ds",
	},
	{
		kind: "video",
		label: "Demo video",
		href: "https://youtube.com",
		host: "youtube.com",
		meta: "4:12",
	},
	{
		kind: "paper",
		label: "Architecture brief",
		href: "/brief.pdf",
		host: "PDF",
		meta: "8 pages",
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
			description="Render a compact project-detail sidebar for live links, source code, docs, design files, videos, and other CMS-driven resources."
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
