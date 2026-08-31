"use client"

import {
	Field,
	FieldDescription,
	FieldError,
} from "@chitrank2050/monoline-ui/field"
import { Input } from "@chitrank2050/monoline-ui/input"
import { Label } from "@chitrank2050/monoline-ui/label"

import { ComponentPlayground } from "../../_components/component-playground"

const usageCode = `<Field invalid>
  <Label htmlFor="email">Email</Label>
  <Input id="email" aria-invalid="true" aria-describedby="email-error" />
  <Field.Error id="email-error">Enter a valid email address.</Field.Error>
</Field>`

export default function FieldPageClient() {
	return (
		<ComponentPlayground
			title="Field"
			description="Group a label, form control, supporting copy, and validation message without hiding their native semantics."
			importStatement='import { Field } from "@chitrank2050/monoline-ui/field"'
			usageCode={usageCode}
			sourceSnippet={usageCode}
			props={[
				["invalid", "boolean", "Marks the field group as invalid"],
				["disabled", "boolean", "Dims a disabled field group"],
				[
					"Field.Description",
					"compound slot",
					"Supporting text for the control",
				],
				[
					"Field.Error",
					"compound slot",
					"Live validation feedback with alert semantics",
				],
			]}
			tokens={[
				["--text-muted", "Description text"],
				["--destructive", "Validation text"],
				["--font-mono", "Validation label typography"],
			]}
			renderPreview={() => (
				<div className="min-w-112 p-ml-8">
					<p className="mb-ml-4 font-mono text-3xs tracking-eyebrow text-(--accent) uppercase">
						Release notifications
					</p>
					<Field invalid className="border-l border-(--border-strong) pl-ml-4">
						<Label htmlFor="field-email">Email address</Label>
						<Input
							id="field-email"
							variant="error"
							aria-invalid="true"
							aria-describedby="field-hint field-error"
							placeholder="you@example.com"
						/>
						<FieldDescription id="field-hint">
							Used only for account notifications.
						</FieldDescription>
						<FieldError id="field-error">
							Enter a valid email address.
						</FieldError>
					</Field>
				</div>
			)}
		/>
	)
}
