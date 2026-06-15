"use client"

import { useState } from "react"

import {
	Tag,
	type TagSize,
	type TagVariant,
} from "@chitrank2050/monoline-ui/tag"

import { ComponentPlayground } from "../../_components/component-playground"

const tagVariants: TagVariant[] = ["filter", "chip"]
const tagSizes: TagSize[] = ["sm", "md", "lg"]

const usageCode = `<Tag variant="filter" active>
  Professional
  <Tag.Count>3</Tag.Count>
</Tag>

<Tag variant="chip" size="sm" interactive={false}>
  Next.js
</Tag>`

const sourceSnippet = `import { Tag } from "@chitrank2050/monoline-ui/tag"

export function ProjectMeta() {
  return (
    <div className="flex flex-wrap gap-2">
      <Tag variant="filter" active>Professional<Tag.Count>3</Tag.Count></Tag>
      <Tag variant="filter">Personal<Tag.Count>3</Tag.Count></Tag>
      <Tag variant="chip" size="sm" interactive={false}>Next.js</Tag>
      <Tag variant="chip" size="sm" interactive={false}>Postgres</Tag>
    </div>
  )
}`

const propsRows = [
	["active", "boolean", "Maps to aria-pressed and active styling"],
	[
		"variant",
		'"filter" | "chip"',
		"Use filter for top-level tabs and chip for quiet metadata",
	],
	[
		"interactive",
		"boolean",
		"Renders a button when true and an inert label when false. Defaults to true for filter and false for chip.",
	],
	["size", "sm | md | lg", "Tag scale"],
	["children", "ReactNode", "Label and optional compound count"],
] as const

const tokenRows = [
	["--duration-micro", "Color-only hover and selection transition duration"],
	["--focus-ring", "Accessible focus shadow"],
	["--primary / --primary-foreground", "Active tag palette"],
	["--border-strong", "Inactive tag border"],
] as const

function TagDemo({ size, variant }: { size: TagSize; variant: TagVariant }) {
	const [activeTag, setActiveTag] = useState<"professional" | "personal">(
		"professional"
	)

	if (variant === "chip") {
		return (
			<div className="flex flex-wrap items-center gap-ml-2 p-ml-6">
				{["Next.js", "tRPC", "Postgres", "+3 more"].map((label) => (
					<Tag
						key={label}
						size={size === "lg" ? "md" : "sm"}
						variant="chip"
						interactive={false}
					>
						{label}
					</Tag>
				))}
			</div>
		)
	}

	return (
		<div className="flex flex-wrap items-center gap-ml-2 p-ml-6">
			<Tag
				size={size}
				variant="filter"
				active={activeTag === "professional"}
				onClick={() => setActiveTag("professional")}
			>
				Professional
				<Tag.Count>3</Tag.Count>
			</Tag>
			<Tag
				size={size}
				variant="filter"
				active={activeTag === "personal"}
				onClick={() => setActiveTag("personal")}
			>
				Personal
				<Tag.Count>3</Tag.Count>
			</Tag>
		</div>
	)
}

export default function TagPageClient() {
	return (
		<ComponentPlayground<TagSize, TagVariant>
			title="Tag"
			description="Render either filter pills for collection switching or quieter chips for dense card metadata."
			sizes={tagSizes}
			defaultSize="md"
			variants={tagVariants}
			defaultVariant="filter"
			importStatement='import { Tag } from "@chitrank2050/monoline-ui/tag"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(size = "md", _theme, variant = "filter") => (
				<TagDemo size={size} variant={variant} />
			)}
		/>
	)
}
