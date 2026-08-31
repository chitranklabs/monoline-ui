"use client"

import { useState } from "react"

import { Button } from "@chitrank2050/monoline-ui/button"
import { CommandSearch } from "@chitrank2050/monoline-ui/command-search"

import { ComponentPlayground } from "../../../_components/component-playground"

const usageCode = `<CommandSearch
  open={open}
  onOpenChange={setOpen}
  placeholder="Search docs or actions..."
  showFooter
>
  <CommandSearch.Input />
  <CommandSearch.List>
    <CommandSearch.Group heading="Documentation">
      <CommandSearch.Item value="navbar component" onSelect={() => navigate("/navbar")}>
        Navbar Component
      </CommandSearch.Item>
      <CommandSearch.Item value="select component" onSelect={() => navigate("/select")}>
        Select Component
      </CommandSearch.Item>
    </CommandSearch.Group>
    <CommandSearch.Empty />
  </CommandSearch.List>
</CommandSearch>`

const sourceSnippet = `import { useState } from "react"
import { Button } from "@chitrank2050/monoline-ui/button"
import { CommandSearch } from "@chitrank2050/monoline-ui/command-search"

export function SearchTrigger() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Palette</Button>
      <CommandSearch
        open={open}
        onOpenChange={setOpen}
        placeholder="Type to search..."
        shortcut={false} // Disable global shortcut to prevent page conflicts
      >
        <CommandSearch.Input />
        <CommandSearch.List>
          <CommandSearch.Group heading="Links">
            <CommandSearch.Item value="home" onSelect={() => navigate("/home")}>
              Home
            </CommandSearch.Item>
            <CommandSearch.Item value="about" onSelect={() => navigate("/about")}>
              About
            </CommandSearch.Item>
          </CommandSearch.Group>
          <CommandSearch.Empty />
        </CommandSearch.List>
        {/* Render the default footer layout */}
        <CommandSearch.Footer />
      </CommandSearch>
    </>
  )
}`

const propsRows = [
	["open", "boolean", "Controlled modal open state"],
	["onOpenChange", "(open: boolean) => void", "Fires when open state changes"],
	[
		"shortcut",
		"string | false",
		"Keyboard shortcut to toggle open state (default: 'k')",
	],
	[
		"debounce",
		"number | false",
		"Query change event debouncing in ms (default: 200)",
	],
	["minChars", "number", "Min characters to trigger filtering (default: 1)"],
	["placeholder", "string", "Placeholder text inside search input"],
	[
		"shouldFilter",
		"boolean",
		"Enables local fuzzy search/filtering on items (default: true)",
	],
	[
		"showFooter",
		"boolean",
		"Enables default footer rendering with keyboard hints (default: false)",
	],
	["CommandSearch.Input", "Compound Component", "Text input element"],
	["CommandSearch.List", "Compound Component", "Scrollable list container"],
	[
		"CommandSearch.Group",
		"Compound Component",
		"Visual grouping container with a heading prop",
	],
	[
		"CommandSearch.Item",
		"Compound Component",
		"Selectable list option (requires a value string)",
	],
	[
		"CommandSearch.Empty",
		"Compound Component",
		"Fallback displayed when no items match",
	],
	[
		"CommandSearch.Footer",
		"Compound Component",
		"Customizable footer container for keyboard hints or actions",
	],
] as const

const tokenRows = [
	["--background / --card", "Modal surface backgrounds"],
	["--border", "Input and divider borders"],
	["--accent", "Highlighted option hover treatment"],
	["--font-mono", "Badge / shortcut kbd fonts"],
] as const

function CommandSearchDemo() {
	const [open, setOpen] = useState(false)

	return (
		<div className="flex min-h-[14rem] w-full flex-col items-center justify-center p-ml-8">
			<Button variant="secondary" onClick={() => setOpen(true)}>
				Open Command Palette
			</Button>

			<CommandSearch
				open={open}
				onOpenChange={setOpen}
				placeholder="Search documentation or actions..."
				shortcut={false}
				showFooter
			>
				<CommandSearch.Input />
				<CommandSearch.List>
					<CommandSearch.Group heading="Documentation Pages">
						<CommandSearch.Item
							value="navbar component design system"
							onSelect={() => {
								alert("Navigating to Navbar docs")
								setOpen(false)
							}}
						>
							<span className="flex-1">Navbar Component</span>
							<span className="font-mono text-[10px] text-text-muted">
								Docs
							</span>
						</CommandSearch.Item>
						<CommandSearch.Item
							value="select component dropdown select-list"
							onSelect={() => {
								alert("Navigating to Select docs")
								setOpen(false)
							}}
						>
							<span className="flex-1">Select Component</span>
							<span className="font-mono text-[10px] text-text-muted">
								Docs
							</span>
						</CommandSearch.Item>
						<CommandSearch.Item
							value="command search component palette dialog search"
							onSelect={() => {
								alert("Navigating to CommandSearch docs")
								setOpen(false)
							}}
						>
							<span className="flex-1">CommandSearch Component</span>
							<span className="font-mono text-[10px] text-accent">Active</span>
						</CommandSearch.Item>
					</CommandSearch.Group>

					<CommandSearch.Group heading="Theme Settings">
						<CommandSearch.Item
							value="toggle light theme"
							onSelect={() => {
								alert("Switching to light theme")
								setOpen(false)
							}}
						>
							Toggle Light Mode
						</CommandSearch.Item>
						<CommandSearch.Item
							value="toggle dark theme"
							onSelect={() => {
								alert("Switching to dark theme")
								setOpen(false)
							}}
						>
							Toggle Dark Mode
						</CommandSearch.Item>
					</CommandSearch.Group>

					<CommandSearch.Empty />
				</CommandSearch.List>
			</CommandSearch>
		</div>
	)
}

export default function CommandSearchPageClient() {
	return (
		<ComponentPlayground<any, any>
			title="CommandSearch"
			description="Build a modal command palette with grouped results, filtering, keyboard navigation, and optional shortcut."
			sizes={[]}
			defaultSize="md"
			variants={[]}
			defaultVariant="default"
			importStatement='import { CommandSearch } from "@chitrank2050/monoline-ui/command-search"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			previewLayout="viewport"
			renderPreview={() => <CommandSearchDemo />}
		/>
	)
}
