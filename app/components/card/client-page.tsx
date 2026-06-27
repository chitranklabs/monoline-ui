"use client"

import { Card, type CardSize } from "@chitrank2050/monoline-ui/components/card"
import { Tag } from "@chitrank2050/monoline-ui/tag"

import { ComponentPlayground } from "../../_components/component-playground"

const cardSizes: CardSize[] = ["sm", "md", "lg"]

const usageCode = `<Card href="/blog/tunic-storefront" size="md">
  <Card.Image ratio="landscape" placeholder>
    <Card.ImageCaption>COVER · STOREFRONT</Card.ImageCaption>
  </Card.Image>
  <Card.Body>
    <Card.Header>
      <Card.Meta>
        <span>2022</span>
        <span>Professional</span>
      </Card.Meta>
      <Card.Title>Tunic Storefront</Card.Title>
      <Card.Eyebrow>Tunic · Advisor → Founding Eng, 2022–23</Card.Eyebrow>
      <Card.Description lines={3}>
        A headless commerce framework for boutique brands. Replaces three SaaS tools with a single Next.js app.
      </Card.Description>
    </Card.Header>
  </Card.Body>
  <Card.Footer>
    <Card.TagList totalCount={4}>
      <Tag variant="chip" size="sm">Next.js</Tag>
      <Tag variant="chip" size="sm">Sanity</Tag>
      <Tag variant="chip" size="sm">Vercel</Tag>
    </Card.TagList>
    <Card.Action>View <Card.Arrow /></Card.Action>
  </Card.Footer>
</Card>`

const sourceSnippet = `import { Card } from "@chitrank2050/monoline-ui/components/card"

export function ProjectCard() {
  return (
    <Card href="/projects/tunic-storefront">
      <Card.Image ratio="landscape" placeholder>
        <Card.ImageCaption>COVER · STOREFRONT</Card.ImageCaption>
      </Card.Image>
      <Card.Body>
        <Card.Header>
          <Card.Meta>
            <span>2022</span>
            <span>Professional</span>
          </Card.Meta>
          <Card.Title>Tunic Storefront</Card.Title>
          <Card.Eyebrow>Tunic · Advisor → Founding Eng, 2022–23</Card.Eyebrow>
          <Card.Description lines={3}>
            A headless commerce framework for boutique brands. Replaces three SaaS tools with a single Next.js app.
          </Card.Description>
        </Card.Header>
      </Card.Body>
      <Card.Footer>
        <Card.TagList totalCount={4}>
          <Tag variant="chip" size="sm">Next.js</Tag>
          <Tag variant="chip" size="sm">Sanity</Tag>
          <Tag variant="chip" size="sm">Vercel</Tag>
        </Card.TagList>
        <Card.Action>View <Card.Arrow /></Card.Action>
      </Card.Footer>
    </Card>
  )
}`

const propsRows = [
	["size", "sm | md | lg", "Card radius and internal slot spacing"],
	[
		"href",
		"string",
		"Render the card as a native anchor for internal or external links",
	],
	["target", '"_self" | "_blank" | "_parent" | "_top"', "Native anchor target"],
	[
		"rel",
		"string",
		"Native anchor rel. Defaults to noopener noreferrer for target=_blank",
	],
	[
		"Card.Image.ratio",
		'"square" | "portrait" | "landscape" | "wide"',
		"Reserved image area preset",
	],
	[
		"Card.Image.placeholder",
		"boolean",
		"Renders the built-in media placeholder",
	],
	[
		"Card.ImageCaption",
		"ReactNode",
		"Bottom-aligned media label with built-in fade",
	],
	["Card.Eyebrow", "ReactNode", "Secondary mono line under the title"],
	["Card.Description.lines", "2 | 3 | 4", "Built-in description clamping"],
	[
		"Card.TagList.totalCount",
		"number",
		"Computes a smart +N marker from rendered tags vs total count",
	],
	["asChild", "boolean", "Render child through Radix Slot"],
	["children", "ReactNode", "Card slots and content"],
] as const

const tokenRows = [
	["--surface", "Card background"],
	["--border", "Default card outline"],
	["--shadow-card", "Hover elevation"],
	["--duration-short", "Image color and surface feedback timing"],
] as const

export default function CardPageClient() {
	return (
		<ComponentPlayground<CardSize>
			title="Card"
			description="Compose linked, static, or button-backed editorial cards from image, body, footer, tag, and action slots."
			sizes={cardSizes}
			defaultSize="md"
			importStatement='import { Card } from "@chitrank2050/monoline-ui/components/card"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(size = "md") => (
				<div className="grid gap-ml-5 p-ml-6 sm:grid-cols-2">
					<Card size={size} href="/blog/tunic-storefront" className="max-w-90">
						<Card.Image ratio="landscape" placeholder>
							<Card.ImageCaption>COVER · STOREFRONT</Card.ImageCaption>
						</Card.Image>
						<Card.Body>
							<Card.Header>
								<Card.Meta>
									<span>2022</span>
									<span>Professional</span>
								</Card.Meta>
								<Card.Title>Tunic Storefront</Card.Title>
								<Card.Eyebrow>
									Tunic · Advisor → Founding Eng, 2022–23
								</Card.Eyebrow>
								<Card.Description lines={3}>
									A headless commerce framework for boutique brands. Replaces
									three SaaS tools with a single Next.js app that the marketing
									team can actually use.
								</Card.Description>
							</Card.Header>
						</Card.Body>
						<Card.Footer>
							<Card.TagList totalCount={4}>
								<Tag size="sm" variant="chip">
									Next.js
								</Tag>
								<Tag size="sm" variant="chip">
									Sanity
								</Tag>
								<Tag size="sm" variant="chip">
									Vercel
								</Tag>
							</Card.TagList>
							<Card.Action>
								View
								<Card.Arrow />
							</Card.Action>
						</Card.Footer>
					</Card>
				</div>
			)}
		/>
	)
}
