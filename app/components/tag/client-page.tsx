"use client"

import { useState } from "react"

import { Tag, type TagSize } from "@chitrank2050/monoline-ui/tag"

import { ComponentPlayground } from "../../_components/component-playground"

const tagSizes: TagSize[] = ["sm", "md", "lg"]

const usageCode = `// 1. Unselected filter with prefix (dashed border)
<Tag prefix="Environment">Production</Tag>

// 2. Selected filter with dismiss ✕ button
<Tag prefix="Status" selected onDismiss={() => handleClear("Status")}>
  Error
</Tag>

// 3. Selected category with suffix count
<Tag selected suffix="3">
  Professional
</Tag>

// 4. Plain counter tag
<Tag>6 errors</Tag>`

const sourceSnippet = `import { useState } from "react"
import { Tag } from "@chitrank2050/monoline-ui/tag"

export function FilterToolbar() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>("Error")
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>("chitrank2050")
  const [selectedCategory, setSelectedCategory] = useState<string | null>("Professional")

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tag
        prefix="Status"
        selected={selectedStatus !== null}
        onClick={() => setSelectedStatus(selectedStatus ? null : "Error")}
        onDismiss={() => setSelectedStatus(null)}
      >
        {selectedStatus ?? "All"}
      </Tag>

      <Tag
        prefix="Author"
        selected={selectedAuthor !== null}
        onClick={() => setSelectedAuthor(selectedAuthor ? null : "chitrank2050")}
        onDismiss={() => setSelectedAuthor(null)}
      >
        {selectedAuthor ?? "All"}
      </Tag>

      <Tag
        suffix="3"
        selected={selectedCategory === "Professional"}
        onClick={() =>
          setSelectedCategory(
            selectedCategory === "Professional" ? null : "Professional"
          )
        }
      >
        Professional
      </Tag>

      <Tag prefix="Environment">Production</Tag>
    </div>
  )
}`

const propsRows = [
	[
		"prefix",
		"ReactNode",
		"Muted key label with subtle opacity (e.g. 'Status', 'Author', 'Environment')",
	],
	[
		"suffix",
		"ReactNode",
		"Muted suffix or count badge with subtle opacity (e.g. '3', 'items')",
	],
	[
		"selected",
		"boolean",
		"Solid border with elevated surface fill and highlighted text. Renders circular ✕ if onDismiss is provided",
	],
	["onDismiss", "() => void", "Callback when the ✕ dismiss button is clicked"],
	[
		"dismissAriaLabel",
		"string",
		"Accessible label for the dismiss button (defaults to 'Remove filter')",
	],
	[
		"size",
		'"sm" | "md" | "lg"',
		"Maintains exact foundation height, padding, and font-size tokens",
	],
	["active", "boolean", "Alias for selected"],
	["children", "ReactNode", "Main tag value or descriptive label"],
] as const

const tokenRows = [
	[
		"--duration-micro",
		"Transition duration for hover and active state transitions",
	],
	[
		"--border-strong",
		"Border color for dashed unselected and solid active states",
	],
	["--button", "Subtle elevated surface fill for active and hovered tags"],
	[
		"--button-hover",
		"Elevated surface fill for hover on active tags and dismiss button",
	],
	["--text-muted", "Prefix, suffix, and unselected default text color"],
	["--text", "Hover and active value text color"],
] as const

function TagDemo({ size }: { size: TagSize }) {
	const [filters, setFilters] = useState<{ [key: string]: boolean }>({
		Status: true,
		Author: true,
		Environment: false,
		Professional: true,
	})

	const toggleFilter = (key: string) => {
		setFilters((prev) => ({ ...prev, [key]: !prev[key] }))
	}

	const dismissFilter = (key: string) => {
		setFilters((prev) => ({ ...prev, [key]: false }))
	}

	return (
		<div className="flex flex-col items-center gap-ml-4 p-ml-6">
			<div className="flex flex-wrap items-center justify-center gap-ml-2">
				<Tag
					size={size}
					prefix="Status"
					selected={filters.Status}
					onClick={() => toggleFilter("Status")}
					onDismiss={() => dismissFilter("Status")}
				>
					Error
				</Tag>

				<Tag
					size={size}
					prefix="Author"
					selected={filters.Author}
					onClick={() => toggleFilter("Author")}
					onDismiss={() => dismissFilter("Author")}
				>
					chitrank2050
				</Tag>

				<Tag
					size={size}
					prefix="Environment"
					selected={filters.Environment}
					onClick={() => toggleFilter("Environment")}
					onDismiss={() => dismissFilter("Environment")}
				>
					Production
				</Tag>

				<Tag
					size={size}
					suffix="3"
					selected={filters.Professional}
					onClick={() => toggleFilter("Professional")}
				>
					Professional
				</Tag>

				<Tag size={size} onClick={() => {}}>
					6 errors
				</Tag>
			</div>

			<p className="text-3xs font-mono text-text-muted">
				Dashed default border transitions to solid on hover/active. Click to
				toggle; click ✕ to dismiss.
			</p>
		</div>
	)
}

export default function TagPageClient() {
	return (
		<ComponentPlayground<TagSize, string>
			title="Tag"
			description="Build filter tags with pressed state, optional counts, prefix and suffix slots, and a dismiss action."
			sizes={tagSizes}
			defaultSize="md"
			importStatement='import { Tag } from "@chitrank2050/monoline-ui/tag"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(size = "md") => <TagDemo size={size} />}
		/>
	)
}
