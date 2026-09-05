"use client"

import { useState } from "react"

import { Checkbox } from "@chitrank2050/monoline-ui/checkbox"
import { Label } from "@chitrank2050/monoline-ui/label"

import { ComponentPlayground } from "../../../_components/component-playground"

const example = `<Checkbox id="updates" checked={checked} onCheckedChange={(value) => setChecked(value === true)} />
<Label htmlFor="updates">Email product updates</Label>`

function CheckboxDemo() {
	const [checked, setChecked] = useState(true)
	return (
		<div className="min-w-112 p-ml-8">
			<div className="border-y border-(--border) py-ml-5">
				<p className="m-0 font-mono text-3xs tracking-eyebrow text-(--accent) uppercase">
					Notifications
				</p>
				<div className="mt-ml-4 flex items-start gap-ml-3">
					<Checkbox
						id="updates-demo"
						checked={checked}
						onCheckedChange={(value) => setChecked(value === true)}
					/>
					<div className="grid gap-ml-1">
						<Label htmlFor="updates-demo">Email product updates</Label>
						<p className="m-0 text-xs text-text-muted">
							A short digest when a new version ships.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default function CheckboxPageClient() {
	return (
		<ComponentPlayground
			title="Checkbox"
			description="Represent independent yes-or-no choices with keyboard support and controlled or uncontrolled state."
			importStatement='import { Checkbox } from "@chitrank2050/monoline-ui/checkbox"'
			usageCode={example}
			sourceSnippet={example}
			props={[
				["checked", "boolean | indeterminate", "Controlled checked state"],
				["defaultChecked", "boolean", "Initial uncontrolled state"],
				["onCheckedChange", "(state) => void", "Runs when the state changes"],
				["disabled", "boolean", "Prevents interaction"],
			]}
			tokens={[
				["--accent / --accent-foreground", "Checked surface and mark"],
				["--border-strong", "Unchecked border"],
				["--focus-ring", "Keyboard focus"],
			]}
			renderPreview={() => <CheckboxDemo />}
		/>
	)
}
