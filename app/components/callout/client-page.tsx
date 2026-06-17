"use client"

import { Callout, type CalloutVariant } from "@chitrank2050/monoline-ui/callout"

import { ComponentPlayground } from "../../_components/component-playground"

const calloutVariants: CalloutVariant[] = ["note", "tip", "warn"]

const usageCode = `<Callout variant="note" label="Optional Label">
  This is a basic informational callout.
</Callout>
<Callout variant="tip">
  This is a helpful tip callout.
</Callout>
<Callout variant="warn">
  This is a warning callout.
</Callout>`

const sourceSnippet = `import { Callout } from "@chitrank2050/monoline-ui/callout"

export function CalloutDemo() {
  return (
    <Callout variant="tip" label="Pro Tip">
      Use code-splitting in tsup to optimize bundles.
    </Callout>
  )
}`

const propsRows = [
	["variant", "note | tip | warn", "Visual styling variant"],
	["label", "string", "Optional label displayed on top of the content"],
] as const

const tokenRows = [
	["--callout-tip-accent", "Tip variant accent color"],
	["--callout-warn-accent", "Warning variant accent color"],
] as const

export default function CalloutPageClient() {
	return (
		<ComponentPlayground<CalloutVariant>
			title="Callout"
			description="Aside blocks used to call attention to warnings, tips, or informational notes."
			sizes={calloutVariants}
			defaultSize="note"
			importStatement='import { Callout } from "@chitrank2050/monoline-ui/callout"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(variant = "note") => (
				<div className="grid gap-ml-5 p-ml-6 w-full max-w-2xl">
					<Callout variant={variant}>
						This is a {variant} block. Use this component to highlight important
						details or instructions inside copy documents.
					</Callout>
				</div>
			)}
		/>
	)
}
