"use client"

import { CodeBlock } from "@chitrank2050/monoline-ui/code-block"

import { ComponentPlayground } from "../../_components/component-playground"

const usageCode = `<CodeBlock
  filename="example.js"
  language="javascript"
  code="const msg = 'Hello World';\nconsole.log(msg);"
/>`

const sourceSnippet = `import { CodeBlock } from "@chitrank2050/monoline-ui/code-block"

export function CodeBlockDemo() {
  const code = \`import React from "react"\nexport default function App() {}\`
  return <CodeBlock filename="App.jsx" language="javascript" code={code} />
}`

const propsRows = [
	["filename", "string", "Label shown in the header of the code block"],
	["code", "string", "Raw code string to display and copy"],
	[
		"language",
		"string",
		"Code language syntax identification for preformatted blocks",
	],
] as const

const tokenRows = [
	["--code", "Code block background color"],
	["--code-text", "Default text color inside block"],
] as const

export default function CodeBlockPageClient() {
	return (
		<ComponentPlayground
			title="CodeBlock"
			description="Renders syntax blocks with a customized header filename and built-in copy clipboard utility."
			importStatement='import { CodeBlock } from "@chitrank2050/monoline-ui/code-block"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={() => (
				<div className="grid gap-ml-5 p-ml-6 w-full max-w-2xl">
					<CodeBlock
						filename="index.js"
						language="javascript"
						code={`import { Button } from "@chitrank2050/monoline-ui/button"\n\nexport default function Home() {\n  return <Button>Contact</Button>\n}`}
					/>
				</div>
			)}
		/>
	)
}
