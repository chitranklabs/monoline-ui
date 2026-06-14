"use client"

import { Card, type CardSize } from "@chitrank2050/monoline-ui/components/card"
import { Tag } from "@chitrank2050/monoline-ui/tag"

import { ComponentPlayground } from "../../_components/component-playground"

const cardSizes: CardSize[] = ["sm", "md", "lg"]

const usageCode = `<Card variant="hover" size="md">
  <Card.Image ratio="landscape">
    <img src="/cover.jpg" alt="" />
  </Card.Image>
  <Card.Body>
    <Card.Header>
      <Card.Meta>
        <span>2023</span>
        <span>Professional</span>
      </Card.Meta>
      <Card.Title>Mosaic Checkout</Card.Title>
      <Card.Description>
        A distributed checkout SDK for emerging-market PSPs.
      </Card.Description>
    </Card.Header>
  </Card.Body>
  <Card.Footer>
    <div className="flex flex-wrap gap-2">
      <Tag variant="chip" size="sm">React Native</Tag>
      <Tag variant="chip" size="sm">Node.js</Tag>
    </div>
    <Card.Action>View <Card.Arrow /></Card.Action>
  </Card.Footer>
</Card>`

const sourceSnippet = `import { Card } from "@chitrank2050/monoline-ui/components/card"

export function ProjectCard() {
  return (
    <Card variant="hover">
      <Card.Image ratio="landscape" placeholder />
      <Card.Body>
        <Card.Header>
          <Card.Meta>
            <span>2024</span>
            <span>Professional</span>
          </Card.Meta>
          <Card.Title>Lumen Insights</Card.Title>
          <Card.Description>
            A compact project card for selected work and blog indexes.
          </Card.Description>
        </Card.Header>
      </Card.Body>
      <Card.Footer>
        <div className="flex flex-wrap gap-2">
          <Tag variant="chip" size="sm">Next.js</Tag>
          <Tag variant="chip" size="sm">Postgres</Tag>
        </div>
        <Card.Action>View <Card.Arrow /></Card.Action>
      </Card.Footer>
    </Card>
  )
}`

const propsRows = [
	["variant", "default | hover | interactive", "Card interaction style"],
	["size", "sm | md | lg", "Card radius and internal slot spacing"],
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
	["asChild", "boolean", "Render child through Radix Slot"],
	["children", "ReactNode", "Card slots and content"],
] as const

const tokenRows = [
	["--surface", "Card background"],
	["--border", "Default card outline"],
	["--shadow-card", "Hover elevation"],
	["--duration-short", "Card lift, image zoom, and arrow reveal timing"],
] as const

export default function CardPageClient() {
	return (
		<ComponentPlayground<CardSize>
			title="Card"
			description="Compose quiet project and blog cards from image, body, footer, and arrow slots."
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
						<Card.Image ratio="landscape" placeholder />
						<Card.Body>
							<Card.Header>
								<Card.Meta>
									<span>2023</span>
									<span>Professional</span>
								</Card.Meta>
								<Card.Title>Mosaic Checkout</Card.Title>
								<Card.Description>
									A distributed checkout SDK built for emerging-market PSPs.
								</Card.Description>
							</Card.Header>
						</Card.Body>
						<Card.Footer>
							<div className="flex flex-wrap gap-ml-2">
								<Tag size="sm" variant="chip">
									React Native
								</Tag>
								<Tag size="sm" variant="chip">
									Node.js
								</Tag>
								<Tag size="sm" variant="chip">
									gRPC
								</Tag>
							</div>
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
