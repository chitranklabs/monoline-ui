"use client"

import { Testimonial } from "@chitrank2050/monoline-ui/testimonial"
import {
	TestimonialGrid,
	type TestimonialGridVariant,
} from "@chitrank2050/monoline-ui/testimonial-grid"

import { ComponentPlayground } from "../../_components/component-playground"

const gridLayouts: TestimonialGridVariant[] = ["grid", "masonry"]

const quotes = [
	{
		quote:
			"The system feels considered without getting in the way. It gives the portfolio enough structure to scale while preserving the writing.",
		author: "Sam Carter",
		role: "Staff Engineer",
		initials: "SC",
	},
	{
		quote: "Compact, practical, and easy to compose.",
		author: "Riya Mehta",
		role: "Founder",
		initials: "RM",
	},
	{
		quote:
			"The masonry treatment is the right call here. Quotes keep their natural rhythm, so the section feels editorial instead of artificially equalized.",
		author: "Priya Sharma",
		role: "Design Partner",
		initials: "PS",
	},
	{
		quote: "Looks like a system, not a template.",
		author: "Marcus Webb",
		role: "Engineer",
		initials: "MW",
	},
	{
		quote:
			"The component API stayed small, but the layout covers the real case: mixed quote lengths across breakpoints.",
		author: "Elena Ortiz",
		role: "Director",
		initials: "EO",
	},
]

const usageCode = `import { Testimonial } from "@chitrank2050/monoline-ui/testimonial"
import { TestimonialGrid } from "@chitrank2050/monoline-ui/testimonial-grid"

<TestimonialGrid variant="grid">
  <Testimonial quote="Short and direct." author="Sam Carter" initials="SC" />
  <Testimonial quote="Longer testimonial copy stretches to align with its row." author="Riya Mehta" initials="RM" />
</TestimonialGrid>

<TestimonialGrid variant="masonry">
  <Testimonial quote="Short and direct." author="Sam Carter" initials="SC" />
  <Testimonial quote="Longer testimonial copy keeps natural height and flows into columns." author="Riya Mehta" initials="RM" />
</TestimonialGrid>`

const sourceSnippet = `import { Testimonial } from "@chitrank2050/monoline-ui/testimonial"
import { TestimonialGrid } from "@chitrank2050/monoline-ui/testimonial-grid"

export function Testimonials() {
  return (
    <TestimonialGrid variant="masonry">
      {items.map((item) => (
        <Testimonial key={item.author} variant="plain" {...item} />
      ))}
    </TestimonialGrid>
  )
}`

const propsRows = [
	["children", "ReactNode", "Testimonial cards or compatible card elements"],
	[
		"variant",
		"grid | masonry",
		"Grid aligns row heights; masonry preserves natural card heights",
	],
	["align", "start | stretch", "Grid item alignment; defaults to stretch"],
	["className", "string?", "Optional class override"],
] as const

const tokenRows = [
	["--ml-testimonial-grid-gap", "Column and row rhythm"],
	["--bp-tablet-min", "Tablet breakpoint reference"],
	["--container-lg", "Recommended content width"],
] as const

export default function TestimonialGridPageClient() {
	return (
		<ComponentPlayground<TestimonialGridVariant>
			title="TestimonialGrid"
			description="Arrange testimonial cards in aligned grid or masonry layouts without JavaScript measurement."
			sizes={gridLayouts}
			defaultSize="masonry"
			sizeControlLabel="Layout"
			allSizesLabel="All layouts"
			formatSize={(layout) => (layout === "grid" ? "Grid" : "Masonry")}
			importStatement='import { TestimonialGrid } from "@chitrank2050/monoline-ui/testimonial-grid"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			previewLayout="viewport"
			renderPreview={(layout = "masonry") => (
				<div className="max-w-5xl p-ml-6">
					<TestimonialGrid variant={layout}>
						{quotes.map((quote) => (
							<Testimonial
								key={quote.author}
								variant="plain"
								quote={quote.quote}
								author={quote.author}
								role={quote.role}
								initials={quote.initials}
							/>
						))}
					</TestimonialGrid>
				</div>
			)}
		/>
	)
}
