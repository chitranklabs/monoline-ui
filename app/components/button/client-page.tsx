"use client"

import { Button, type ButtonSize } from "@chitrank2050/monoline-ui/button"

import { ComponentPlayground } from "../../_components/component-playground"

const buttonSizes: ButtonSize[] = ["sm", "md", "lg"]

const usageCode = `<Button variant="primary" size="md">
  Contact me
  <Button.Arrow />
</Button>

<Button variant="secondary" size="md">Resume</Button>
<Button variant="ghost" size="md">
  View projects
  <Button.Arrow />
</Button>
<Button variant="secondary" size="md">
  Book a call
  <Button.Arrow reveal />
</Button>
<Button loading>Submit</Button>
<Button asChild>
  <a href="/contact">Contact</a>
</Button>`

const sourceSnippet = `import { Button } from "@chitrank2050/monoline-ui/button"

export function Actions() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button>Contact me<Button.Arrow /></Button>
      <Button variant="secondary">Resume</Button>
      <Button variant="ghost">View projects<Button.Arrow /></Button>
      <Button variant="secondary">Book a call<Button.Arrow reveal /></Button>
      <Button loading>Submit</Button>
    </div>
  )
}`

const propsRows = [
	["variant", "primary | secondary | ghost", "Visual intent"],
	["size", "sm | md | lg", "Button scale"],
	["icon", "boolean", "Square icon-only dimensions"],
	["pill", "boolean", "Fully rounded button"],
	["loading", "boolean", "Busy state with spinner and disabled behavior"],
	["asChild", "boolean", "Render a child element through Radix Slot"],
	[
		"Button.Icon",
		"compound slot",
		"Left/right icon with optional reveal animation",
	],
	["Button.Arrow", "compound slot", "Right arrow shortcut over Button.Icon"],
] as const

const tokenRows = [
	["--duration-micro", "Hover, focus, and press transition duration"],
	["--duration-short", "Opt-in icon reveal transition duration"],
	["--focus-ring", "Accessible focus shadow"],
	["--button / --button-hover", "Secondary button surface"],
] as const

export default function ButtonPageClient() {
	return (
		<ComponentPlayground<ButtonSize>
			title="Button"
			description="Render action buttons with token-backed variants, three sizes, optional icon-only shape, pill rounding, and asChild composition."
			sizes={buttonSizes}
			defaultSize="md"
			importStatement='import { Button } from "@chitrank2050/monoline-ui/button"'
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
						View projects
						<Button.Arrow />
					</Button>
					<Button variant="secondary" size={size}>
						Book a call
						<Button.Arrow reveal />
					</Button>
					<Button size={size} loading>
						Submit
					</Button>
					<Button variant="secondary" size={size} icon aria-label="Copy link">
						↗
					</Button>
				</div>
			)}
		/>
	)
}
