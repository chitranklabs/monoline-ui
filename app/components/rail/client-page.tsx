"use client"

import { Rail } from "@chitrank2050/monoline-ui/rail"

import { ComponentPlayground } from "../../_components/component-playground"

const usageCode = `<Rail title="Filter by topic">
  <Rail.Item active>
    <span>All posts</span>
    <Rail.Count>7</Rail.Count>
  </Rail.Item>
  <Rail.Item>
    <span>Backend</span>
    <Rail.Count>3</Rail.Count>
  </Rail.Item>
</Rail>`

const sourceSnippet = `import { Rail } from "@chitrank2050/monoline-ui/rail"

export function TopicFilter() {
  return (
    <Rail title="Filter by topic">
      <Rail.Item active>
        <span>All posts</span>
        <Rail.Count>7</Rail.Count>
      </Rail.Item>
      <Rail.Item>
        <span>Backend</span>
        <Rail.Count>3</Rail.Count>
      </Rail.Item>
      <Rail.Item>
        <span>Architecture</span>
        <Rail.Count>2</Rail.Count>
      </Rail.Item>
      <Rail.Item>
        <span>Open Source</span>
        <Rail.Count>1</Rail.Count>
      </Rail.Item>
    </Rail>
  )
}`

const propsRows = [
	[
		"title",
		"ReactNode",
		"Section label rendered above the list in mono uppercase",
	],
	[
		"active",
		"boolean (Rail.Item)",
		"Marks the item as the active selection — bold label + accent dot",
	],
	[
		"children",
		"ReactNode",
		"Item content; pass Rail.Count as the second child for a numeric badge",
	],
] as const

const tokenRows = [
	["--accent", "Active dot color"],
	["--text-muted", "Inactive dot and count color"],
] as const

export default function RailPageClient() {
	return (
		<ComponentPlayground
			title="Rail"
			description="Render vertical navigation lists for sidebars, filters, and secondary sections."
			importStatement='import { Rail } from "@chitrank2050/monoline-ui/rail"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={() => (
				<div className="p-ml-6 w-full max-w-56">
					<Rail title="Filter by topic">
						<Rail.Item active>
							<span>All posts</span>
							<Rail.Count>7</Rail.Count>
						</Rail.Item>
						<Rail.Item>
							<span>Backend</span>
							<Rail.Count>3</Rail.Count>
						</Rail.Item>
						<Rail.Item>
							<span>Architecture</span>
							<Rail.Count>2</Rail.Count>
						</Rail.Item>
						<Rail.Item>
							<span>Open Source</span>
							<Rail.Count>1</Rail.Count>
						</Rail.Item>
						<Rail.Item>
							<span>Engineering</span>
							<Rail.Count>1</Rail.Count>
						</Rail.Item>
					</Rail>
				</div>
			)}
		/>
	)
}
