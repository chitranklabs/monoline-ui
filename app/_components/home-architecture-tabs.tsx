"use client"

import { useState } from "react"

import { SegmentedControl } from "@chitrank2050/monoline-ui/segmented-control"

import { CodeBlock } from "./code-block"

const tabs = [
	{
		id: "setup",
		label: "01 · One-Line Setup",
		filename: "src/app/globals.css",
		language: "css",
		code: `@import "tailwindcss";
@import "@chitrank2050/monoline-ui/theme.css";

/* Done. Semantic OKLCH tokens and component styles are ready. */`,
		description:
			"Import the package theme once. Monoline registers its compiled styles with Tailwind CSS v4 automatically.",
	},
	{
		id: "subpaths",
		label: "02 · Subpath Tree Shaking",
		filename: "src/app/page.tsx",
		language: "tsx",
		code: `import { Button } from "@chitrank2050/monoline-ui/button"
import { Card } from "@chitrank2050/monoline-ui/card"
import { Toggle } from "@chitrank2050/monoline-ui/toggle"

export default function Page() {
  return (
    <Card href="/projects">
      <Card.Body>
        <Card.Title>My Portfolio</Card.Title>
      </Card.Body>
    </Card>
  )
}`,
		description:
			"Each component has its own dedicated subpath entry point. Bundlers import only the exact code you use.",
	},
	{
		id: "rebrand",
		label: "03 · OKLCH Rebranding",
		filename: "src/app/globals.css",
		language: "css",
		code: `/* Rebrand all 47 components with 3 lines of CSS */
[data-theme="dark"] {
  --accent: oklch(0.8 0.12 65);       /* Custom brand accent */
  --surface: oklch(0.14 0.02 260);    /* Custom midnight surface */
  --font-mono: var(--font-jetbrains); /* Custom typography */
}`,
		description:
			"Rebrand the entire component suite without forking or overriding classes. All components automatically adapt.",
	},
]

export function HomeArchitectureTabs() {
	const [activeTab, setActiveTab] = useState("setup")
	const current = tabs.find((t) => t.id === activeTab) ??
		tabs[0] ?? {
			id: "setup",
			label: "01 · One-Line Setup",
			filename: "src/app/globals.css",
			language: "css",
			code: "",
			description: "",
		}

	return (
		<div className="flex flex-col gap-4">
			<div className="overflow-x-auto pb-1">
				<SegmentedControl
					size="sm"
					options={tabs.map((t) => ({ value: t.id, label: t.label }))}
					value={activeTab}
					onChange={setActiveTab}
				/>
			</div>

			<div className="overflow-hidden border border-border rounded-xl bg-surface">
				<div className="border-b border-border bg-surface-2/40 px-4 py-3">
					<p className="m-0 text-xs text-text-secondary leading-relaxed font-medium">
						{current.description}
					</p>
				</div>
				<CodeBlock
					fileName={current.filename}
					code={current.code}
					language={current.language}
				/>
			</div>
		</div>
	)
}
