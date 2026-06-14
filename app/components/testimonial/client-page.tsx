"use client"

import {
	Testimonial,
	type TestimonialSize,
} from "@chitrank2050/monoline-ui/testimonial"

import { ComponentPlayground } from "../../_components/component-playground"

const testimonialSizes: TestimonialSize[] = ["sm", "md", "lg"]

const usageCode = `<Testimonial
  size="md"
  variant="plain"
  quote="The system feels considered without getting in the way."
  author="Sam Carter"
  role="Staff Engineer"
  initials="SC"
/>

<Testimonial.Grid>
  <Testimonial quote="Short and direct." author="Sam Carter" initials="SC" />
  <Testimonial quote="Longer quote copy can breathe without forcing every other card into the same height." author="Riya Mehta" initials="RM" />
</Testimonial.Grid>`

const sourceSnippet = `import { Testimonial } from "@chitrank2050/monoline-ui/testimonial"

export function Quote() {
  return (
    <Testimonial.Grid>
      <Testimonial
        variant="plain"
        quote="Dense, editorial, and still easy to ship."
        author="Riya Mehta"
        role="Founder"
        initials="RM"
      />
      <Testimonial
        variant="plain"
        quote="The layout handles longer quotes without stretching every card in the row."
        author="Sam Carter"
        role="Staff Engineer"
        initials="SC"
      />
    </Testimonial.Grid>
  )
}`

const propsRows = [
	["size", "sm | md | lg", "Testimonial scale"],
	["variant", "default | plain", "Quote mark or compact card treatment"],
	["quote", "ReactNode", "Quoted body copy"],
	["author", "ReactNode", "Person name"],
	["role", "ReactNode?", "Supporting role or context"],
	["initials", "string?", "Avatar fallback initials"],
	["avatarSrc", "string?", "Optional avatar image"],
	[
		"Testimonial.Grid",
		"compound layout",
		"Masonry grid: 1 column mobile, 2 tablet, 3 desktop",
	],
] as const

const tokenRows = [
	["--surface", "Card background"],
	["--border", "Card outline"],
	["--accent", "Quote mark colour"],
] as const

export default function TestimonialPageClient() {
	return (
		<ComponentPlayground<TestimonialSize>
			title="Testimonial"
			description="Render editorial social proof with quote, author metadata, and built-in avatar fallback."
			sizes={testimonialSizes}
			defaultSize="md"
			importStatement='import { Testimonial } from "@chitrank2050/monoline-ui/testimonial"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			previewLayout="viewport"
			renderPreview={(size = "md") => (
				<div className="max-w-5xl p-ml-6">
					<Testimonial.Grid>
						<Testimonial
							size={size}
							variant="plain"
							quote="The system feels considered without getting in the way. It gives the portfolio enough structure to scale while preserving the writing."
							author="Sam Carter"
							role="Staff Engineer"
							initials="SC"
						/>
						<Testimonial
							size={size}
							variant="plain"
							quote="Compact, practical, and easy to compose."
							author="Riya Mehta"
							role="Founder"
							initials="RM"
						/>
						<Testimonial
							size={size}
							variant="plain"
							quote="The masonry treatment is the right call here. Quotes keep their natural rhythm, so the section feels editorial instead of artificially equalized."
							author="Priya Sharma"
							role="Design Partner"
							initials="PS"
						/>
						<Testimonial
							size={size}
							variant="plain"
							quote="Looks like a system, not a template."
							author="Marcus Webb"
							role="Engineer"
							initials="MW"
						/>
						<Testimonial
							size={size}
							variant="plain"
							quote="The component API stayed small, but the layout covers the real case: mixed quote lengths across breakpoints."
							author="Elena Ortiz"
							role="Director"
							initials="EO"
						/>
					</Testimonial.Grid>
				</div>
			)}
		/>
	)
}
