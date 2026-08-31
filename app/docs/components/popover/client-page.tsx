"use client"

import { Button } from "@chitrank2050/monoline-ui/button"
import { Popover } from "@chitrank2050/monoline-ui/popover"

import { ComponentPlayground } from "../../../_components/component-playground"

const usageCode = `<Popover>
  <Popover.Trigger asChild>
    <Button variant="secondary">Project details</Button>
  </Popover.Trigger>
	<Popover.Content side="bottom" align="start">
	<p className="ml-eyebrow">Deployment · Production</p>
    <p>Last deployed 8 minutes ago.</p>
    <Popover.Arrow />
  </Popover.Content>
</Popover>`

export default function PopoverPageClient() {
	return (
		<ComponentPlayground
			title="Popover"
			description="Anchor contextual content to a trigger with collision-aware positioning, outside dismissal, and automatic focus restoration."
			importStatement='import { Popover } from "@chitrank2050/monoline-ui/popover"'
			usageCode={usageCode}
			sourceSnippet={usageCode}
			props={[
				["open", "boolean", "Controlled open state"],
				["defaultOpen", "boolean", "Initial uncontrolled state"],
				["onOpenChange", "(open) => void", "Runs whenever open state changes"],
				["Popover.Trigger", "compound slot", "Control that opens the popover"],
				[
					"Popover.Anchor",
					"compound slot",
					"Optional positioning anchor separate from the trigger",
				],
				["Popover.Content", "compound slot", "Positioned contextual surface"],
				[
					"side",
					'"top" | "right" | "bottom" | "left"',
					"Preferred placement; flips automatically when space is limited",
				],
				[
					"align",
					'"start" | "center" | "end"',
					"Alignment along the chosen side",
				],
				[
					"collisionBoundary",
					"Element | Element[]",
					"Optional clipping boundary; defaults to the viewport",
				],
				[
					"collisionPadding",
					"number | SideObject",
					"Minimum space from the collision boundary; defaults to 12px",
				],
				["Popover.Close", "compound slot", "Control that closes the popover"],
				["Popover.Arrow", "compound slot", "Optional arrow toward the anchor"],
			]}
			tokens={[
				["--popover", "Popover surface"],
				["--border", "Floating boundary"],
				["--shadow-md", "Floating elevation"],
				["--z-dropdown", "Overlay order"],
			]}
			renderPreview={(_size, theme) => (
				<div className="flex min-h-64 items-center justify-center p-ml-8">
					<Popover>
						<Popover.Trigger asChild>
							<Button variant="secondary">Project details</Button>
						</Popover.Trigger>
						<Popover.Content align="start" data-theme={theme} side="bottom">
							<p className="ml-eyebrow">Deployment · Production</p>
							<p className="m-0 text-sm font-semibold text-text">
								Documentation site
							</p>
							<p className="mt-ml-1 mb-0 text-xs text-text-muted">
								Last deployed 8 minutes ago.
							</p>
							<Popover.Arrow />
						</Popover.Content>
					</Popover>
				</div>
			)}
		/>
	)
}
