"use client"

import { useState } from "react"

import { SegmentedControl } from "@chitrank2050/monoline-ui/segmented-control"

import { CodeBlock } from "./code-block"

const tabs = [
	{
		id: "setup",
		label: "01 · Theme setup",
		filename: "src/app/globals.css",
		language: "css",
		code: `@import "tailwindcss";
@import "@chitrank2050/monoline-ui/theme.css";


/* Add data-theme="light" or "dark" to the root html element. */`,
		description:
			"Import the package theme once. It registers the compiled component sources and exposes the semantic CSS variables.",
	},
	{
		id: "subpaths",
		label: "02 · Direct exports",
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
			"Each component has a direct subpath entry. This keeps application imports explicit and avoids relying on the root barrel.",
	},
	{
		id: "rebrand",
		label: "03 · Token overrides",
		filename: "src/app/globals.css",
		language: "css",
		code: `/* Load overrides after the package theme. */
[data-theme="dark"] {
	  --accent: oklch(0.8 0.12 65);
	  --surface: oklch(0.14 0.02 260);
	  --font-mono: var(--font-jetbrains);
}`,
		description:
			"Override semantic roles after the package import. Components that read those roles will use the new values without selector overrides.",
	},
]

export function HomeArchitectureTabs() {
	const [activeTab, setActiveTab] = useState("setup")
	const current = tabs.find((t) => t.id === activeTab) ??
		tabs[0] ?? {
			id: "setup",
			label: "01 · Theme setup",
			filename: "src/app/globals.css",
			language: "css",
			code: "",
			description: "",
		}

	return (
		<div className="flex flex-col gap-ml-4">
			<div className="overflow-x-auto pb-ml-1">
				<SegmentedControl
					size="sm"
					options={tabs.map((t) => ({ value: t.id, label: t.label }))}
					value={activeTab}
					onChange={setActiveTab}
				/>
			</div>

			<CodeBlock
				description={current.description}
				fileName={current.filename}
				code={current.code}
				language={current.language}
			/>
		</div>
	)
}
