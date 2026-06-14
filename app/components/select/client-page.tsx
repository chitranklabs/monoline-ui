"use client"

import { useState } from "react"

import {
	Select,
	type SelectOption,
	type SelectSize,
	type SelectVariant,
} from "@chitrank2050/monoline-ui/components/select"

import { ComponentPlayground } from "../../_components/component-playground"

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
  <Select.Content />
</Select>`

const sourceSnippet = `import { Select } from "@chitrank2050/monoline-ui/components/select"

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
      <Select.Content />
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
] as const

const tokenRows = [
	["--surface / --surface-2", "Trigger, menu, and selected row surfaces"],
	["--border / --border-strong", "Trigger and menu borders"],
	["--focus-ring", "Keyboard focus shadow"],
	["--duration-micro + --duration-short", "Trigger and menu motion timing"],
] as const

function SelectDemo({
	size,
	variant,
}: {
	size: SelectSize
	variant: SelectVariant
}) {
	const [sort, setSort] = useState("recent")

	return (
		<div className="flex items-center justify-center p-ml-8">
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
				<Select.Content />
			</Select>
		</div>
	)
}

export default function SelectPageClient() {
	return (
		<ComponentPlayground<SelectSize, SelectVariant>
			title="Select"
			description="A single-choice dropdown for sort orders, filters, and compact view controls. It opens as a bottom sheet on mobile."
			sizes={sizes}
			defaultSize="md"
			variants={variants}
			defaultVariant="default"
			importStatement='import { Select } from "@chitrank2050/monoline-ui/components/select"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(size = "md", _theme, variant = "default") => (
				<SelectDemo size={size} variant={variant} />
			)}
		/>
	)
}
