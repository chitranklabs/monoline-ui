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
/>`

const sourceSnippet = `import { Testimonial } from "@chitrank2050/monoline-ui/testimonial"

export function Quote() {
  return (
    <Testimonial
      variant="plain"
      quote="Dense, editorial, and still easy to ship."
      author="Riya Mehta"
      role="Founder"
      initials="RM"
    />
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
			renderPreview={(size = "md") => (
				<div className="max-w-xl p-ml-6">
					<Testimonial
						size={size}
						variant="plain"
						quote="The system feels considered without getting in the way. It gives the portfolio enough structure to scale while preserving the writing."
						author="Sam Carter"
						role="Staff Engineer"
						initials="SC"
					/>
				</div>
			)}
		/>
	)
}
