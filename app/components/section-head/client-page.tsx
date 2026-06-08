"use client"

import {
	SectionHead,
	type SectionHeadSize,
} from "@chitrank2050/monoline-ui/components/section-head"

import { ComponentPlayground } from "../../_components/component-playground"

const sectionHeadSizes: SectionHeadSize[] = ["sm", "md", "lg", "xl"]

const usageCode = `<SectionHead
  size="lg"
  level={2}
  eyebrow="About · 02"
  title="Architecting scalable systems."
  lede="Interfaces for engineers who need speed without losing taste."
/>`

const sourceSnippet = `import { SectionHead } from "@chitrank2050/monoline-ui/components/section-head"

export function Intro() {
  return (
    <SectionHead
      eyebrow="Introduction"
      title="Opinionated where it counts."
      lede="Token-first components for editorial developer portfolios."
    />
  )
}`

const propsRows = [
	["size", "sm | md | lg | xl", "Heading scale"],
	["level", "1 | 2 | 3", "Semantic heading element"],
	["eyebrow", "ReactNode?", "Optional section label"],
	["title", "ReactNode", "Heading content"],
	["lede", "ReactNode?", "Supporting paragraph"],
] as const

const tokenRows = [
	["--primary", "Heading colour"],
	["--secondary", "Lede colour"],
	["font-mono", "Headline face"],
] as const

export default function SectionHeadPageClient() {
	return (
		<ComponentPlayground<SectionHeadSize>
			title="SectionHead"
			description="Render semantic section introductions with eyebrow, title, lede, and size-driven heading rhythm."
			sizes={sectionHeadSizes}
			defaultSize="lg"
			importStatement='import { SectionHead } from "@chitrank2050/monoline-ui/components/section-head"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(size = "lg") => (
				<div className="max-w-3xl p-ml-6">
					<SectionHead
						size={size}
						level={size === "xl" ? 1 : 2}
						eyebrow="About · 02"
						title="Architecting scalable systems."
						lede="Interfaces for engineers who need speed without losing taste."
					/>
				</div>
			)}
		/>
	)
}
