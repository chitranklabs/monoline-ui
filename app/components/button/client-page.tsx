"use client"

import {
	Button,
	type ButtonSize,
} from "@chitrank2050/monoline-ui/components/button"

import { ComponentPlayground } from "../../_components/component-playground"

const buttonSizes: ButtonSize[] = ["sm", "md", "lg"]

const usageCode = `<Button variant="primary" size="md">
  Contact me
  <Button.Arrow />
</Button>

<Button variant="secondary" size="md">Resume</Button>
<Button variant="accent" size="md" pill>Like</Button>
<Button asChild>
  <a href="/contact">Contact</a>
</Button>`

const sourceSnippet = `import { Button } from "@chitrank2050/monoline-ui/components/button"

export function Actions() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button>Contact me<Button.Arrow /></Button>
      <Button variant="secondary">Resume</Button>
      <Button variant="ghost">Book a call</Button>
      <Button variant="accent" pill>Like</Button>
    </div>
  )
}`

const propsRows = [
	["variant", "primary | secondary | ghost | accent | danger", "Visual intent"],
	["size", "sm | md | lg", "Button scale"],
	["icon", "boolean", "Square icon-only dimensions"],
	["pill", "boolean", "Fully rounded button"],
	["asChild", "boolean", "Render a child element through Radix Slot"],
] as const

const tokenRows = [
	["--duration-micro", "Hover, focus, and press transition duration"],
	["--focus-ring", "Accessible focus shadow"],
	["--button / --button-hover", "Secondary button surface"],
	["--accent / --accent-soft", "Accent button palette"],
] as const

export default function ButtonPageClient() {
	return (
		<ComponentPlayground<ButtonSize>
			title="Button"
			description="Render action buttons with token-backed variants, three sizes, optional icon-only shape, pill rounding, and asChild composition."
			sizes={buttonSizes}
			defaultSize="md"
			importStatement='import { Button } from "@chitrank2050/monoline-ui/components/button"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(size = "md") => (
				<div className="flex flex-wrap items-center gap-ml-3 p-ml-6">
					<Button size={size}>
						Contact me
						<Button.Arrow />
					</Button>
					<Button variant="secondary" size={size}>
						Resume
					</Button>
					<Button variant="ghost" size={size}>
						Book a call
					</Button>
					<Button variant="accent" size={size} pill>
						Like
					</Button>
					<Button variant="danger" size={size}>
						Delete
					</Button>
					<Button variant="secondary" size={size} icon aria-label="Copy link">
						↗
					</Button>
				</div>
			)}
		/>
	)
}
