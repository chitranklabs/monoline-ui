"use client"

import { Button } from "@chitrank2050/monoline-ui/button"
import { Tooltip } from "@chitrank2050/monoline-ui/tooltip"

import { ComponentPlayground } from "../../_components/component-playground"

const example = `<Tooltip.Provider>
  <Tooltip>
    <Tooltip.Trigger asChild><Button>Copy</Button></Tooltip.Trigger>
		<Tooltip.Content side="top">Copy install command</Tooltip.Content>
  </Tooltip>
</Tooltip.Provider>`

export default function TooltipPageClient() {
	return (
		<ComponentPlayground
			title="Tooltip"
			description="Add concise supporting context to a focusable control without replacing its accessible name."
			importStatement='import { Tooltip } from "@chitrank2050/monoline-ui/tooltip"'
			usageCode={example}
			sourceSnippet={example}
			props={[
				[
					"Tooltip.Provider",
					"compound slot",
					"Shares delay behavior across tooltips",
				],
				[
					"Tooltip.Trigger",
					"compound slot",
					"Focusable element that opens the tooltip",
				],
				[
					"Tooltip.Content",
					"compound slot",
					"Supporting text rendered in a portal",
				],
				["delayDuration", "number", "Delay before pointer-triggered opening"],
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
			]}
			tokens={[
				["--primary", "Tooltip surface"],
				["--border", "Tooltip boundary"],
				["--shadow-md", "Floating elevation"],
				["--z-tooltip", "Overlay order"],
			]}
			renderPreview={(_size, theme) => (
				<div className="min-w-112 p-ml-10">
					<Tooltip.Provider>
						<Tooltip>
							<Tooltip.Trigger asChild>
								<Button variant="secondary">Copy command</Button>
							</Tooltip.Trigger>
							<Tooltip.Content data-theme={theme} side="top">
								Copy the pnpm install command
							</Tooltip.Content>
						</Tooltip>
					</Tooltip.Provider>
				</div>
			)}
		/>
	)
}
