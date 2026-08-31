"use client"

import {
	Status,
	type StatusSize,
} from "@chitrank2050/monoline-ui/components/status"

import { ComponentPlayground } from "../../../_components/component-playground"

const statusSizes: StatusSize[] = ["sm", "md", "lg"]

const usageCode = `<Status size="md" variant="accent">Open to work</Status>
<Status size="md" variant="success">Available</Status>
<Status size="md" variant="muted">Archived</Status>`

const sourceSnippet = `import { Status } from "@chitrank2050/monoline-ui/components/status"

export function Availability() {
  return <Status>Open to work</Status>
}`

const propsRows = [
	["size", "sm | md | lg", "Status pill scale"],
	["variant", "accent | success | muted", "Visual state"],
	[
		"animate",
		"boolean",
		"Add pulse animation to the status dot (default: false)",
	],
	["children", "ReactNode", "Status label"],
] as const

const tokenRows = [
	["--accent", "Default status colour"],
	["--accent-soft", "Default status background"],
	["--callout-tip-accent", "Success state colour"],
] as const

export default function StatusPageClient() {
	return (
		<ComponentPlayground<StatusSize>
			title="Status"
			description="Show compact state labels with a stable dot, tone, and optional pulse animation."
			sizes={statusSizes}
			defaultSize="md"
			importStatement='import { Status } from "@chitrank2050/monoline-ui/components/status"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(size = "md") => (
				<div className="flex flex-wrap items-center gap-ml-3 p-ml-6">
					<Status size={size}>Open to work</Status>
					<Status size={size} variant="success">
						Available
					</Status>
					<Status size={size} variant="muted">
						Archived
					</Status>
				</div>
			)}
		/>
	)
}
