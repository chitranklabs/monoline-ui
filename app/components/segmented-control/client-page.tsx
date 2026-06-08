"use client"

import { useState } from "react"

import {
	SegmentedControl,
	type SegmentedControlVariant,
} from "@chitrank2050/monoline-ui/segmented-control"

import { ComponentPlayground } from "../../_components/component-playground"

const variants: SegmentedControlVariant[] = ["default", "pill"]

const usageCode = `<SegmentedControl
  variant="pill"
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
	["variant", '"default" | "pill"', "Visual style variant"],
	["className", "string", "Additional CSS classes"],
] as const

const tokenRows = [
	["--border / --border-strong", "Track border colors"],
	["--surface / --surface-2", "Indicator and track backgrounds"],
	["--primary / --primary-foreground", "Pill variant indicator and text"],
	["--duration-short + --ease-out-expo", "Indicator slide animation"],
] as const

function SegmentedControlDemo({
	variant,
}: {
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

	return (
		<div className="flex flex-wrap items-center justify-center gap-ml-5 p-ml-8">
			<SegmentedControl
				variant={variant}
				value={value}
				onChange={setValue}
				options={variant === "pill" ? pillOptions : defaultOptions}
			/>
		</div>
	)
}

export default function SegmentedControlPageClient() {
	return (
		<ComponentPlayground<SegmentedControlVariant>
			title="SegmentedControl"
			description="A single-select group with a sliding indicator. Use the pill variant for feature-level filters and the default variant for compact UI controls."
			sizes={variants}
			defaultSize="pill"
			importStatement='import { SegmentedControl } from "@chitrank2050/monoline-ui/segmented-control"'
			formatSize={(s) => s.charAt(0).toUpperCase() + s.slice(1)}
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(variant = "pill") => (
				<SegmentedControlDemo variant={variant} />
			)}
		/>
	)
}
