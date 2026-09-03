"use client"

import { CodeBlock } from "@chitrank2050/monoline-ui/code-block"

import { ComponentPlayground } from "../../../_components/component-playground"

const usageCode = `<CodeBlock
  description="Configure Tailwind CSS v4 and import Monoline tokens."
  filename="src/app/globals.css"
  language="css"
  code="@import 'tailwindcss';\n@import '@chitrank2050/monoline-ui/theme.css';"
/>`

const sourceSnippet = `import { CodeBlock } from "@chitrank2050/monoline-ui/code-block"

export function CodeBlockDemo() {
  const code = \`import React from "react"
export default function App() {
  return <h1>Hello Monoline</h1>
}\`

  return (
    <CodeBlock
      description="Quick start template for React 19 applications."
      filename="src/App.tsx"
      language="tsx"
      code={code}
    />
  )
}`

const propsRows = [
	[
		"description",
		"ReactNode",
		"Optional contextual banner or guide text rendered above the filename header",
	],
	[
		"filename",
		"string",
		"Optional label shown in the header bar of the code block",
	],
	["code", "string", "Raw code string to display, format, and copy"],
	[
		"language",
		"string",
		"Code language syntax identification for preformatted blocks",
	],
] as const

const tokenRows = [
	["--code", "Code block background surface"],
	["--code-text", "Default syntax text color inside block"],
	["--border", "Hairline stroke around container and section dividers"],
] as const

export default function CodeBlockPageClient() {
	return (
		<ComponentPlayground
			title="CodeBlock"
			description="Display preformatted code with optional contextual descriptions, filename headers, language metadata, and 1-click clipboard copying."
			importStatement='import { CodeBlock } from "@chitrank2050/monoline-ui/code-block"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={() => (
				<div className="grid gap-ml-6 p-ml-6 w-full max-w-2xl">
					{/* Example with Description and Filename */}
					<CodeBlock
						description="Import the theme stylesheet once to register all OKLCH design tokens with Tailwind CSS v4."
						filename="src/app/globals.css"
						language="css"
						code={`@import "tailwindcss";\n@import "@chitrank2050/monoline-ui/theme.css";\n\n/* Semantic tokens and component styles are ready */`}
					/>

					{/* Example without Description */}
					<CodeBlock
						filename="src/components/button.tsx"
						language="tsx"
						code={`import { Button } from "@chitrank2050/monoline-ui/button"\n\nexport function ActionButton() {\n  return <Button size="md">Get Started</Button>\n}`}
					/>
				</div>
			)}
		/>
	)
}
