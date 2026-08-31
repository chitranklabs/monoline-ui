"use client"

import { Button } from "@chitrank2050/monoline-ui/button"
import { DropdownMenu } from "@chitrank2050/monoline-ui/dropdown-menu"

import { ComponentPlayground } from "../../_components/component-playground"

const example = `<DropdownMenu>
  <DropdownMenu.Trigger asChild><Button variant="secondary">Actions</Button></DropdownMenu.Trigger>
	<DropdownMenu.Content side="bottom" align="end">
    <DropdownMenu.Label>Project</DropdownMenu.Label>
    <DropdownMenu.Item>Duplicate <DropdownMenu.Shortcut>⌘D</DropdownMenu.Shortcut></DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item destructive>Delete</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu>`

export default function DropdownMenuPageClient() {
	return (
		<ComponentPlayground
			slug="dropdown-menu"
			title="Dropdown Menu"
			description="Place secondary actions in a compact menu with roving focus, typeahead, disabled states, and escape handling."
			importStatement='import { DropdownMenu } from "@chitrank2050/monoline-ui/dropdown-menu"'
			usageCode={example}
			sourceSnippet={example}
			props={[
				[
					"DropdownMenu.Trigger",
					"compound slot",
					"Control that opens the menu",
				],
				[
					"DropdownMenu.Content",
					"compound slot",
					"Portal-mounted menu surface",
				],
				["DropdownMenu.Item", "compound slot", "Selectable action"],
				[
					"DropdownMenu.CheckboxItem / RadioItem",
					"compound slots",
					"Persistent menu choices",
				],
				["DropdownMenu.Sub", "compound slot", "Nested action group"],
				["destructive", "boolean", "Marks an irreversible action"],
				["inset", "boolean", "Aligns copy with icon-bearing items"],
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
				["--popover", "Menu surface"],
				["--surface-2", "Highlighted and selected item"],
				["--border", "Menu boundary"],
				["--destructive", "Destructive actions"],
				["--z-dropdown", "Overlay order"],
			]}
			renderPreview={(_size, theme) => (
				<div className="flex min-h-64 min-w-112 items-center p-ml-10">
					<DropdownMenu>
						<DropdownMenu.Trigger asChild>
							<Button variant="secondary">Project actions</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content
							align="start"
							data-theme={theme}
							side="bottom"
						>
							<DropdownMenu.Label>Project</DropdownMenu.Label>
							<DropdownMenu.Group>
								<DropdownMenu.Item>Open</DropdownMenu.Item>
								<DropdownMenu.Item>
									Duplicate<DropdownMenu.Shortcut>⌘D</DropdownMenu.Shortcut>
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									Copy link<DropdownMenu.Shortcut>⌘C</DropdownMenu.Shortcut>
								</DropdownMenu.Item>
								<DropdownMenu.Item disabled>Archive</DropdownMenu.Item>
							</DropdownMenu.Group>
							<DropdownMenu.Separator />
							<DropdownMenu.Item destructive>Delete project</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu>
				</div>
			)}
		/>
	)
}
