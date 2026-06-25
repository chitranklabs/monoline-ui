"use client"

import { useEffect, useState } from "react"

import Prism from "prismjs"
import "prismjs/components/prism-css"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-typescript"

import { CodeBlock as LibCodeBlock } from "../../src/components/code-block"

interface CodeBlockProps {
	code: string
	language?: string
	fileName?: string
}

export function CodeBlock({
	code,
	language = "jsx",
	fileName,
}: CodeBlockProps) {
	const [html, setHtml] = useState<string | null>(null)

	useEffect(() => {
		const grammar = (Prism.languages[language] ||
			Prism.languages.javascript) as Prism.Grammar
		setHtml(Prism.highlight(code, grammar, language))
	}, [code, language])

	return (
		<LibCodeBlock filename={fileName} code={code} language={language}>
			<pre
				className={`ml-code-block__pre m-0 overflow-auto p-4 font-mono text-[12.5px] leading-[1.7] language-${language}`}
			>
				{html !== null ? (
					<code
						className={`language-${language}`}
						dangerouslySetInnerHTML={{ __html: html }}
					/>
				) : (
					<code className={`language-${language}`}>{code}</code>
				)}
			</pre>
		</LibCodeBlock>
	)
}
