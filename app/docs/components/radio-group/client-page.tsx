"use client"

import { useState } from "react"

import { RadioGroup } from "@chitrank2050/monoline-ui/radio-group"

import { ComponentPlayground } from "../../../_components/component-playground"

const example = `<RadioGroup value={plan} onValueChange={setPlan} aria-label="Billing cycle">
  <RadioGroup.Item value="monthly" label="Monthly" />
  <RadioGroup.Item value="annual" label="Annual" description="Save two months" />
</RadioGroup>`

function RadioDemo() {
	const [value, setValue] = useState("annual")
	return (
		<div className="min-w-112 p-ml-8">
			<p className="mb-ml-4 font-mono text-3xs tracking-eyebrow text-(--accent) uppercase">
				Billing cycle
			</p>
			<div className="border-y border-(--border) py-ml-3">
				<RadioGroup
					value={value}
					onValueChange={setValue}
					aria-label="Billing cycle"
				>
					<RadioGroup.Item
						value="monthly"
						label="Monthly"
						description="Pay month to month"
					/>
					<RadioGroup.Item
						value="annual"
						label="Annual"
						description="Save two months"
					/>
					<RadioGroup.Item
						value="enterprise"
						label="Enterprise"
						description="Contact us for pricing"
						disabled
					/>
				</RadioGroup>
			</div>
		</div>
	)
}

export default function RadioGroupPageClient() {
	return (
		<ComponentPlayground
			slug="radio-group"
			title="Radio Group"
			description="Let people choose exactly one option from a visible set, with arrow-key navigation and optional supporting copy."
			importStatement='import { RadioGroup } from "@chitrank2050/monoline-ui/radio-group"'
			usageCode={example}
			sourceSnippet={example}
			props={[
				["value", "string", "Controlled selected value"],
				["defaultValue", "string", "Initial uncontrolled value"],
				["onValueChange", "(value) => void", "Runs when selection changes"],
				[
					"RadioGroup.Item",
					"compound slot",
					"Choice with optional label and description",
				],
			]}
			tokens={[
				["--accent", "Selected indicator and control border"],
				["--border-strong", "Control border"],
				["--text-muted", "Supporting copy"],
			]}
			renderPreview={() => <RadioDemo />}
		/>
	)
}
