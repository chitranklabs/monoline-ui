"use client"

import { Input, type InputSize } from "@chitrank2050/monoline-ui/input"

import { ComponentPlayground } from "../../_components/component-playground"

const inputSizes: InputSize[] = ["sm", "md", "lg"]

const usageCode = `<Input placeholder="Search projects..." />
<Input size="sm" placeholder="Small input" />
<Input size="lg" placeholder="Large input" />
<Input variant="error" placeholder="Invalid value" />
<Input prefix="🔍" placeholder="Search docs..." />
<Input suffix="USD" placeholder="0.00" />`

const sourceSnippet = `import { Input } from "@chitrank2050/monoline-ui/input"

export function Form() {
  return (
    <div className="flex flex-col gap-3 max-w-sm">
      <Input prefix="@" placeholder="Username" />
      <Input placeholder="Enter password" type="password" />
    </div>
  )
}`

const propsRows = [
	["variant", "default | error", "Visual validation status"],
	["size", "sm | md | lg", "Component scale"],
	["prefix", "ReactNode", "Slot for prefix icons or labels"],
	["suffix", "ReactNode", "Slot for suffix icons or labels"],
	[
		"wrapperClassName",
		"string",
		"Optional class applied to outer label element",
	],
] as const

const tokenRows = [
	["--duration-micro", "Interaction active transition duration"],
	["--input", "Default field borders and backgrounds"],
] as const

export default function InputPageClient() {
	return (
		<ComponentPlayground<InputSize>
			title="Input"
			description="Render text fields with prefix and suffix slots, validation state, and consistent control sizing."
			sizes={inputSizes}
			defaultSize="md"
			importStatement='import { Input } from "@chitrank2050/monoline-ui/input"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(size = "md") => (
				<div className="grid gap-ml-5 p-ml-6 w-full max-w-sm">
					<div className="flex flex-col gap-ml-3">
						<Input size={size} placeholder="Standard input" />
						<Input
							size={size}
							variant="error"
							placeholder="Error state input"
						/>
						<Input size={size} prefix="🔍" placeholder="Input with prefix" />
						<Input size={size} suffix="USD" placeholder="Input with suffix" />
					</div>
				</div>
			)}
		/>
	)
}
