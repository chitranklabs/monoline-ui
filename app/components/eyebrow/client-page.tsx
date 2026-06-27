"use client"

import {
	Eyebrow,
	type EyebrowSize,
} from "@chitrank2050/monoline-ui/components/eyebrow"

import { ComponentPlayground } from "../../_components/component-playground"

const eyebrowSizes: EyebrowSize[] = ["xs", "sm", "md"]

const usageCode = `<Eyebrow size="sm">Foundations · Colors</Eyebrow>`

const sourceSnippet = `import { Eyebrow } from "@chitrank2050/monoline-ui/components/eyebrow"

export function SectionLabel() {
  return <Eyebrow>Selected work · 04</Eyebrow>
}`

const propsRows = [
	["size", "xs | sm | md", "Label scale"],
	["children", "ReactNode", "Short uppercase label text"],
] as const

const tokenRows = [
	["--muted-foreground", "Eyebrow text colour"],
	["font-mono", "Monoline uppercase label face"],
] as const

export default function EyebrowPageClient() {
	return (
		<ComponentPlayground<EyebrowSize>
			title="Eyebrow"
			description="Render compact section labels with mono text, uppercase rhythm, and predictable sizes."
			sizes={eyebrowSizes}
			defaultSize="sm"
			importStatement='import { Eyebrow } from "@chitrank2050/monoline-ui/components/eyebrow"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(size = "sm") => (
				<div className="flex flex-col gap-ml-4 p-ml-6">
					<Eyebrow size={size}>Foundations · Colors</Eyebrow>
					<Eyebrow size={size}>Components · Navigation</Eyebrow>
					<Eyebrow size={size}>Case study · 09 min</Eyebrow>
				</div>
			)}
		/>
	)
}
