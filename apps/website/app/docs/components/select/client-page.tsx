"use client"

import { useState } from "react"

import {
	Select,
	type SelectOption,
	type SelectSize,
	type SelectVariant,
} from "@chitrank2050/monoline-ui/select"

import { ComponentPlayground } from "../../../_components/component-playground"

const sizes: SelectSize[] = ["sm", "md", "lg"]
const variants: SelectVariant[] = ["default", "ghost"]

const sortingOptions = [
	{ value: "recent", label: "Most recent" },
	{ value: "oldest", label: "Oldest first" },
	{ value: "read", label: "Most read" },
	{ value: "az", label: "Alphabetical" },
] satisfies SelectOption[]

const usageCode = `<Select
  value={sort}
  onChange={setSort}
  options={[
    { value: "recent", label: "Most recent" },
    { value: "oldest", label: "Oldest first" },
    { value: "read",   label: "Most read" },
    { value: "az",     label: "Alphabetical" },
  ]}
>
  <Select.Trigger>
    <span className="flex items-baseline gap-2">
      <Select.Label>Sort:</Select.Label>
      <Select.Value />
    </span>
  </Select.Trigger>
	<Select.Content side="bottom" align="start" />
</Select>`

const sourceSnippet = `import { Select } from "@chitrank2050/monoline-ui/select"

export function SortControl() {
  const [sort, setSort] = useState("recent")

  return (
    <Select
      value={sort}
      onChange={setSort}
      options={[
        { value: "recent", label: "Most recent" },
        { value: "oldest", label: "Oldest first" },
        { value: "read", label: "Most read" },
      ]}
      sheetLabel="Sort by"
    >
      <Select.Trigger>
        <span className="flex items-baseline gap-2">
          <Select.Label>Sort:</Select.Label>
          <Select.Value />
        </span>
      </Select.Trigger>
		<Select.Content side="bottom" align="start" />
    </Select>
  )
}`

const propsRows = [
	["children", "ReactNode", "Compose Trigger, Value, Content, and Item slots"],
	["options", "SelectOption<T>[]", "Items shown in the list"],
	["value", "T", "Controlled selected value"],
	["onChange", "(value: T) => void", "Selection change callback"],
	["size", '"sm" | "md" | "lg"', "Trigger scale"],
	["variant", '"default" | "ghost"', "Trigger visual treatment"],
	["sheetLabel", "string", "Mobile bottom-sheet heading"],
	[
		"side",
		'"top" | "right" | "bottom" | "left"',
		"Desktop preferred placement; flips automatically when space is limited",
	],
	[
		"align",
		'"start" | "center" | "end"',
		"Desktop alignment along the chosen side",
	],
	[
		"collisionBoundary",
		"Element | Element[]",
		"Optional desktop clipping boundary; defaults to the viewport",
	],
	[
		"collisionPadding",
		"number | SideObject",
		"Minimum space from the collision boundary; defaults to 12px",
	],
] as const

const tokenRows = [
	[
		"--surface / --surface-2",
		"Neutral trigger, menu, and selected row surfaces",
	],
	["--border / --border-strong", "Resting and interactive boundaries"],
	["--focus-ring", "Keyboard focus shadow"],
	["--duration-micro + --duration-short", "Trigger and menu motion timing"],
] as const

function SelectDemo({
	size,
	theme,
	variant,
}: {
	size: SelectSize
	theme: "light" | "dark"
	variant: SelectVariant
}) {
	const [sort, setSort] = useState("recent")

	return (
		<div className="flex min-h-[18rem] w-full items-start justify-start p-ml-8 md:p-ml-12">
			<Select
				size={size}
				variant={variant}
				value={sort}
				onChange={setSort}
				options={sortingOptions}
				sheetLabel="Sort by"
			>
				<Select.Trigger>
					<span className="flex min-w-0 items-baseline gap-ml-2">
						<Select.Label>Sort:</Select.Label>
						<Select.Value />
					</span>
				</Select.Trigger>
				<Select.Content data-theme={theme} side="bottom" align="start" />
			</Select>
		</div>
	)
}

export default function SelectPageClient() {
	return (
		<ComponentPlayground<SelectSize, SelectVariant>
			title="Select"
			description="Render single-choice dropdowns for sorting, filtering, and view controls with mobile sheet behavior."
			sizes={sizes}
			defaultSize="md"
			variants={variants}
			defaultVariant="default"
			importStatement='import { Select } from "@chitrank2050/monoline-ui/select"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			previewLayout="viewport"
			renderPreview={(size = "md", theme, variant = "default") => (
				<SelectDemo size={size} theme={theme} variant={variant} />
			)}
		/>
	)
}
