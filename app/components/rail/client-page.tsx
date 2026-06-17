"use client"

import { Rail } from "@chitrank2050/monoline-ui/rail"

import { ComponentPlayground } from "../../_components/component-playground"

const usageCode = `<Rail>
  <Rail.Item active>
    <span>Overview</span>
    <Rail.Count>12</Rail.Count>
  </Rail.Item>
  <Rail.Item>
    <span>Components</span>
    <Rail.Count>33</Rail.Count>
  </Rail.Item>
</Rail>`

const sourceSnippet = `import { Rail } from "@chitrank2050/monoline-ui/rail"

export function SidebarRail() {
  return (
    <Rail className="w-48">
      <Rail.Item active>Overview</Rail.Item>
      <Rail.Item>Projects</Rail.Item>
      <Rail.Item>Blog</Rail.Item>
    </Rail>
  )
}`

const propsRows = [
	["active", "boolean (Rail.Item)", "Indicates whether the item is active"],
	["children", "ReactNode", "Label content for Item"],
] as const

const tokenRows = [
	["--accent", "Indicator dot accent color when active"],
] as const

export default function RailPageClient() {
	return (
		<ComponentPlayground
			title="Rail"
			description="Vertical list structures commonly used in sidebars for tabbed sub-navigation."
			importStatement='import { Rail } from "@chitrank2050/monoline-ui/rail"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={() => (
				<div className="grid gap-ml-5 p-ml-6 w-full max-w-sm">
					<div className="border p-ml-4 rounded-md">
						<Rail>
							<Rail.Item active>
								<span>Design System</span>
								<Rail.Count>12</Rail.Count>
							</Rail.Item>
							<Rail.Item>
								<span>Tokens & Styles</span>
								<Rail.Count>8</Rail.Count>
							</Rail.Item>
							<Rail.Item>
								<span>API Reference</span>
								<Rail.Count>33</Rail.Count>
							</Rail.Item>
						</Rail>
					</div>
				</div>
			)}
		/>
	)
}
