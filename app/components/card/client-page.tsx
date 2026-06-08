"use client"

import { Card, type CardSize } from "@chitrank2050/monoline-ui/components/card"

import { ComponentPlayground } from "../../_components/component-playground"

const cardSizes: CardSize[] = ["sm", "md", "lg"]

const usageCode = `<Card variant="hover" size="md">
  <Card.Image>
    <img src="/cover.jpg" alt="" />
  </Card.Image>
  <Card.Body>
    <p className="ml-eyebrow">Engineering · 9 min</p>
    <h3>Designing a type-safe BFF</h3>
  </Card.Body>
  <Card.Footer>
    Read case study
    <Card.Arrow />
  </Card.Footer>
</Card>`

const sourceSnippet = `import { Card } from "@chitrank2050/monoline-ui/components/card"

export function ProjectCard() {
  return (
    <Card variant="hover">
      <Card.Body>
        <p className="ml-eyebrow">Case study</p>
        <h3>Inference dashboard</h3>
        <p>Dense operational UI for model health.</p>
      </Card.Body>
      <Card.Footer>Read more <Card.Arrow /></Card.Footer>
    </Card>
  )
}`

const propsRows = [
	["variant", "default | hover | interactive", "Card interaction style"],
	["size", "sm | md | lg", "Card radius and internal slot spacing"],
	["asChild", "boolean", "Render child through Radix Slot"],
	["children", "ReactNode", "Card slots and content"],
] as const

const tokenRows = [
	["--surface", "Card background"],
	["--border", "Default card outline"],
	["--shadow-card", "Hover elevation"],
	["--duration-short", "Card hover timing"],
] as const

export default function CardPageClient() {
	return (
		<ComponentPlayground<CardSize>
			title="Card"
			description="Compose editorial cards from package slots for image, body, footer, and arrow affordances."
			sizes={cardSizes}
			defaultSize="md"
			importStatement='import { Card } from "@chitrank2050/monoline-ui/components/card"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(size = "md") => (
				<div className="grid gap-ml-5 p-ml-6 sm:grid-cols-2">
					<Card size={size} variant="hover" className="max-w-90">
						<Card.Image className="h-ml-24 bg-[repeating-linear-gradient(135deg,var(--surface-2)_0_1px,transparent_1px_16px)]" />
						<Card.Body>
							<p className="ml-eyebrow">Engineering · 9 min</p>
							<h3 className="m-0 text-lg leading-tight text-primary">
								Designing a type-safe BFF with tRPC and Zod
							</h3>
							<p className="m-0 text-sm leading-relaxed text-body">
								A compact card for posts, projects, and resources.
							</p>
						</Card.Body>
						<Card.Footer>
							<span className="text-sm text-body">Read case study</span>
							<Card.Arrow />
						</Card.Footer>
					</Card>
				</div>
			)}
		/>
	)
}
