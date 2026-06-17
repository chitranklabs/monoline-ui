"use client"

import { PullQuote } from "@chitrank2050/monoline-ui/pull-quote"

import { ComponentPlayground } from "../../_components/component-playground"

const usageCode = `<PullQuote attribution="Chitrank Agnihotri">
  Simplicity is the ultimate sophistication.
</PullQuote>`

const sourceSnippet = `import { PullQuote } from "@chitrank2050/monoline-ui/pull-quote"

export function Quote() {
  return (
    <PullQuote attribution="Design Principles">
      Form follows function, but visual consistency builds trust.
    </PullQuote>
  )
}`

const propsRows = [
	["attribution", "string", "Optional caption source or author attribution"],
] as const

const tokenRows = [["--accent", "Accented left border color"]] as const

export default function PullQuotePageClient() {
	return (
		<ComponentPlayground
			title="PullQuote"
			description="Display styled pullquotes inside long-form articles or copy structures."
			importStatement='import { PullQuote } from "@chitrank2050/monoline-ui/pull-quote"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={() => (
				<div className="grid gap-ml-5 p-ml-6 w-full max-w-2xl">
					<PullQuote attribution="Dieter Rams">
						Good design is as little design as possible. Less, but better –
						because it concentrates on the essential aspects.
					</PullQuote>
				</div>
			)}
		/>
	)
}
