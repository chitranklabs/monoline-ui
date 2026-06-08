"use client"

import {
	Toggle,
	type ToggleSize,
} from "@chitrank2050/monoline-ui/toggle"

import { ComponentPlayground } from "../../_components/component-playground"

const toggleSizes: ToggleSize[] = ["sm", "md", "lg"]

const usageCode = `<Toggle
  checked={enabled}
  onCheckedChange={setEnabled}
  aria-label="Enable notifications"
/>`

const sourceSnippet = `import { Toggle } from "@chitrank2050/monoline-ui/toggle"

export function SettingsToggle() {
  return (
    <Toggle
      defaultChecked
      aria-label="Enable dark mode"
    />
  )
}`

const propsRows = [
	["checked", "boolean", "Controlled checked state"],
	["defaultChecked", "boolean", "Initial uncontrolled checked state"],
	["onCheckedChange", "(checked: boolean) => void", "State change callback"],
	["size", "sm | md | lg", "Toggle scale"],
] as const

const tokenRows = [
	["--duration-medium", "Track and thumb transition duration"],
	["--ease-spring", "Thumb movement easing with soft overshoot"],
	["--accent / --accent-soft", "On-state palette"],
	["--button", "Off-state track surface"],
] as const

export default function TogglePageClient() {
	return (
		<ComponentPlayground<ToggleSize>
			title="Toggle"
			description="Render a controlled or uncontrolled switch with role=switch semantics, spring thumb motion, and three sizes."
			sizes={toggleSizes}
			defaultSize="md"
			importStatement='import { Toggle } from "@chitrank2050/monoline-ui/toggle"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(size = "md") => (
				<div className="flex flex-wrap items-center gap-ml-5 p-ml-6">
					<label className="inline-flex items-center gap-ml-3 text-body">
						<Toggle size={size} defaultChecked aria-label="Enable publishing" />
						<span>Publishing</span>
					</label>
					<label className="inline-flex items-center gap-ml-3 text-body">
						<Toggle size={size} aria-label="Enable drafts" />
						<span>Drafts</span>
					</label>
					<label className="inline-flex items-center gap-ml-3 text-muted-foreground">
						<Toggle size={size} disabled aria-label="Enable archive" />
						<span>Archive</span>
					</label>
				</div>
			)}
		/>
	)
}
