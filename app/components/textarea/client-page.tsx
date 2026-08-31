"use client"

import { Label } from "@chitrank2050/monoline-ui/label"
import { Textarea, type TextareaSize } from "@chitrank2050/monoline-ui/textarea"

import { ComponentPlayground } from "../../_components/component-playground"

const sizes: TextareaSize[] = ["sm", "md", "lg"]
const example = `<Textarea id="summary" placeholder="What changed?" rows={5} />`

export default function TextareaPageClient() {
	return (
		<ComponentPlayground<TextareaSize>
			title="Textarea"
			description="Collect longer responses with native form behavior, clear focus treatment, and controlled resize options."
			sizes={sizes}
			defaultSize="md"
			importStatement='import { Textarea } from "@chitrank2050/monoline-ui/textarea"'
			usageCode={example}
			sourceSnippet={example}
			props={[
				["size", '"sm" | "md" | "lg"', "Control padding and minimum height"],
				["resize", '"none" | "vertical" | "both"', "Allowed resize direction"],
				["aria-invalid", "boolean", "Applies validation styling"],
			]}
			tokens={[
				["--surface", "Control background"],
				["--border-strong", "Control border"],
				["--focus-ring", "Keyboard focus"],
			]}
			renderPreview={(size = "md") => (
				<div className="min-w-128 p-ml-8">
					<div className="grid gap-ml-2 border-l border-(--border-strong) pl-ml-4">
						<p className="m-0 font-mono text-3xs tracking-eyebrow text-(--accent) uppercase">
							Release notes
						</p>
						<Label htmlFor={`summary-${size}`}>Release summary</Label>
						<Textarea
							id={`summary-${size}`}
							size={size}
							placeholder="Describe what changed and why."
						/>
					</div>
				</div>
			)}
		/>
	)
}
