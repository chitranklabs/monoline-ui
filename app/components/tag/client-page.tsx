"use client"

import { Tag, type TagSize } from "@chitrank2050/monoline-ui/components/tag"

import { ComponentPlayground } from "../../_components/component-playground"

const tagSizes: TagSize[] = ["sm", "md", "lg"]

const usageCode = `<Tag active>
  All
  <Tag.Count>23</Tag.Count>
</Tag>

<Tag>
  Engineering
  <Tag.Count>12</Tag.Count>
</Tag>`

const sourceSnippet = `import { Tag } from "@chitrank2050/monoline-ui/components/tag"

export function Filters() {
  return (
    <div className="flex flex-wrap gap-2">
      <Tag active>All<Tag.Count>23</Tag.Count></Tag>
      <Tag>Engineering<Tag.Count>12</Tag.Count></Tag>
      <Tag>React<Tag.Count>8</Tag.Count></Tag>
    </div>
  )
}`

const propsRows = [
	["active", "boolean", "Maps to aria-pressed and active styling"],
	["size", "sm | md | lg", "Tag scale"],
	["children", "ReactNode", "Label and optional compound count"],
] as const

const tokenRows = [
	["--duration-micro", "Hover and active transition duration"],
	["--focus-ring", "Accessible focus shadow"],
	["--primary / --primary-foreground", "Active tag palette"],
	["--border-strong", "Inactive tag border"],
] as const

export default function TagPageClient() {
	return (
		<ComponentPlayground<TagSize>
			title="Tag"
			description="Render filter pills with active state, count metadata, and three token-backed sizes."
			sizes={tagSizes}
			defaultSize="md"
			importStatement='import { Tag } from "@chitrank2050/monoline-ui/components/tag"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(size = "md") => (
				<div className="flex flex-wrap items-center gap-ml-2 p-ml-6">
					<Tag size={size} active>
						All
						<Tag.Count>23</Tag.Count>
					</Tag>
					<Tag size={size}>
						Engineering
						<Tag.Count>12</Tag.Count>
					</Tag>
					<Tag size={size}>
						AI
						<Tag.Count>7</Tag.Count>
					</Tag>
					<Tag size={size}>React</Tag>
					<Tag size={size}>CSS</Tag>
				</div>
			)}
		/>
	)
}
