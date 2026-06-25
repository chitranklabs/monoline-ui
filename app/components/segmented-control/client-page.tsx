"use client"

import { useState } from "react"

import {
	SegmentedControl,
	type SegmentedControlSize,
	type SegmentedControlVariant,
} from "@chitrank2050/monoline-ui/segmented-control"

import { ComponentPlayground } from "../../_components/component-playground"

const variants: SegmentedControlVariant[] = ["default", "pill"]
const sizes: SegmentedControlSize[] = ["sm", "md", "lg"]

const usageCode = `<SegmentedControl
  variant="pill"
  size="md"
  value={activeType}
  onChange={setActiveType}
  options={[
    { value: "professional", label: "Professional", badge: 3 },
    { value: "personal",     label: "Personal",     badge: 3 },
  ]}
/>`

const sourceSnippet = `import { SegmentedControl } from "@chitrank2050/monoline-ui/segmented-control"

export function ProjectFilter() {
  const [type, setType] = useState("professional")

  return (
    <SegmentedControl
      variant="pill"
      size="md"
      value={type}
      onChange={setType}
      options={[
        { value: "professional", label: "Professional", badge: 3 },
        { value: "personal",     label: "Personal",     badge: 3 },
      ]}
    />
  )
}`

const propsRows = [
	["options", "SegmentedControlOption<T>[]", "Array of selectable items"],
	["value", "T", "Controlled selected value"],
	["onChange", "(value: T) => void", "Selection change callback"],
	["variant", '"default" | "pill"', "Visual style variant (default: default)"],
	["size", '"sm" | "md" | "lg"', "Control size scale (default: md)"],
	["className", "string", "Additional CSS classes"],
] as const

const tokenRows = [
	["--border / --border-strong", "Track border colors"],
	["--surface / --surface-2", "Indicator and track backgrounds"],
	["--primary / --primary-foreground", "Pill variant indicator and text"],
	["--duration-short + --ease-out-expo", "Indicator slide animation"],
] as const

function SegmentedControlDemo({
	size,
	variant,
}: {
	size: SegmentedControlSize
	variant: SegmentedControlVariant
}) {
	const [value, setValue] = useState(
		variant === "pill" ? "professional" : "desktop"
	)

	const pillOptions = [
		{ value: "professional", label: "Professional", badge: 3 },
		{ value: "personal", label: "Personal", badge: 3 },
	]

	const defaultOptions = [
		{ value: "mobile", label: "Mobile" },
		{ value: "tablet", label: "Tablet" },
		{ value: "desktop", label: "Desktop" },
		{ value: "wide", label: "Wide" },
	]

	const options = variant === "pill" ? pillOptions : defaultOptions

	return (
		<div className="inline-flex items-center justify-center p-ml-8">
			<SegmentedControl
				variant={variant}
				size={size}
				value={value}
				onChange={setValue}
				options={options}
			/>
		</div>
	)
}

export default function SegmentedControlPageClient() {
	return (
		<ComponentPlayground<SegmentedControlSize, SegmentedControlVariant>
			title="SegmentedControl"
			description="Render single-select controls with roving keyboard focus and default or pill variants."
			sizes={sizes}
			defaultSize="md"
			variants={variants}
			defaultVariant="pill"
			importStatement='import { SegmentedControl } from "@chitrank2050/monoline-ui/segmented-control"'
			formatSize={(s) => s.toUpperCase()}
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(size = "md", theme, variant = "pill") => (
				<SegmentedControlDemo size={size} variant={variant} />
			)}
		/>
	)
}
