"use client"

import { MetaRow } from "@chitrank2050/monoline-ui/meta-row"

import { ComponentPlayground } from "../../_components/component-playground"

const usageCode = `<MetaRow strong>
  <span>June 17, 2026</span>
  <MetaRow.Sep />
  <span>12 comments</span>
  <MetaRow.Sep />
  <span>4 mins</span>
</MetaRow>`

const sourceSnippet = `import { MetaRow } from "@chitrank2050/monoline-ui/meta-row"

export function PostMeta() {
  return (
    <MetaRow>
      <span>June 17, 2026</span>
      <MetaRow.Sep />
      <span>By Chitrank</span>
      <MetaRow.Sep />
      <span>React 19 Reference</span>
    </MetaRow>
  )
}`

const propsRows = [
	[
		"strong",
		"boolean",
		"Renders text in the secondary text color instead of muted color",
	],
	[
		"children",
		"ReactNode",
		"Horizontal elements separated by MetaRow.Sep delimiters",
	],
] as const

const tokenRows = [] as const

export default function MetaRowPageClient() {
	return (
		<ComponentPlayground
			title="MetaRow"
			description="MetaRow is a small inline monospace container designed to render list or card metadata (dates, authors, reading estimates) divided by dot separators."
			importStatement='import { MetaRow } from "@chitrank2050/monoline-ui/meta-row"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={() => (
				<div className="flex flex-col gap-ml-4 p-ml-6">
					<div>
						<h4 className="font-mono text-xs text-(--text-muted) mb-ml-2">
							Default Muted
						</h4>
						<MetaRow>
							<span>June 17, 2026</span>
							<MetaRow.Sep />
							<span>Chitrank Agnihotri</span>
							<MetaRow.Sep />
							<span>Standard Reference</span>
						</MetaRow>
					</div>
					<div>
						<h4 className="font-mono text-xs text-(--text-muted) mb-ml-2">
							Strong Option
						</h4>
						<MetaRow strong>
							<span>June 17, 2026</span>
							<MetaRow.Sep />
							<span>Chitrank Agnihotri</span>
							<MetaRow.Sep />
							<span>Strong Highlight Reference</span>
						</MetaRow>
					</div>
				</div>
			)}
		/>
	)
}
