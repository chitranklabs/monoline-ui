"use client"

import { Input } from "@chitrank2050/monoline-ui/input"
import { Label } from "@chitrank2050/monoline-ui/label"

import { ComponentPlayground } from "../../../_components/component-playground"

const example = `<Label htmlFor="project-name">Project name</Label>
<Input id="project-name" placeholder="Monoline UI" />`

export default function LabelPageClient() {
	return (
		<ComponentPlayground
			title="Label"
			description="Give form controls a visible, clickable name while preserving the native label relationship."
			importStatement='import { Label } from "@chitrank2050/monoline-ui/label"'
			usageCode={example}
			sourceSnippet={example}
			props={[
				["htmlFor", "string", "ID of the associated form control"],
				["children", "ReactNode", "Visible label copy"],
			]}
			tokens={[
				["--text-primary", "Label color"],
				["--text-sm", "Label scale"],
			]}
			renderPreview={() => (
				<div className="min-w-112 p-ml-8">
					<div className="grid gap-ml-2 border-y border-(--border) py-ml-5">
						<p className="m-0 font-mono text-3xs tracking-eyebrow text-(--accent) uppercase">
							Project metadata
						</p>
						<Label htmlFor="label-project">Project name</Label>
						<Input id="label-project" placeholder="Monoline UI" />
					</div>
				</div>
			)}
		/>
	)
}
