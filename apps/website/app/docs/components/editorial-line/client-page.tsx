"use client"

import { EditorialLine } from "@chitrank2050/monoline-ui/editorial-line"

import { ComponentPlayground } from "../../../_components/component-playground"

const usageCode = `<EditorialLine
  n={1}
  date="June 17, 2026"
  title="Refactoring CSS structure for tree-shaking"
  readTime={5}
  tag="Engineering"
  href="#"
/>`

const sourceSnippet = `import { EditorialLine } from "@chitrank2050/monoline-ui/editorial-line"

export function ArticleList() {
  return (
    <div className="flex flex-col w-full">
      <EditorialLine
        n={1}
        date="June 17, 2026"
        title="Introduction to Monoline-UI Design Tokens"
        readTime={4}
        tag="Design"
        href="#"
      />
      <EditorialLine
        n={2}
        date="June 18, 2026"
        title="Layout options and spacing rules"
        readTime={6}
        tag="Reference"
        href="#"
      />
    </div>
  )
}`

const propsRows = [
	["n", "number", "The numeric index label (padded to 2 digits automatically)"],
	["date", "ReactNode", "Date string / element to render"],
	["title", "ReactNode", "Main article/post title content"],
	["readTime", "number", "Optional reading time in minutes"],
	["tag", "ReactNode", "Optional tag category element/string"],
	[
		"href",
		"string",
		"Optional URL path to render the element as an anchor link",
	],
	[
		"hover",
		"boolean",
		"Enables hover background and transition style (defaults to true)",
	],
] as const

const tokenRows = [] as const

export default function EditorialLinePageClient() {
	return (
		<ComponentPlayground
			title="EditorialLine"
			description="Render publication rows with index, date, title, summary, tag, and action metadata."
			importStatement='import { EditorialLine } from "@chitrank2050/monoline-ui/editorial-line"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={() => (
				<div className="flex flex-col w-full max-w-2xl border-t border-border">
					<EditorialLine
						n={1}
						date="June 17, 2026"
						title="Building Premium Design Systems on Next.js 16"
						readTime={4}
						tag="Engineering"
						href="/docs/foundations/colors"
					/>
					<EditorialLine
						n={2}
						date="June 16, 2026"
						title="Exploring Monochrome Aesthetics and Layout Geometry"
						readTime={12}
						tag="Design"
						href="/docs/foundations/spacing"
					/>
					<EditorialLine
						n={3}
						date="June 15, 2026"
						title="Why Code Splitting and Tree-Shaking is Essential"
						readTime={5}
						tag="Performance"
						href="/docs/installation"
					/>
				</div>
			)}
		/>
	)
}
