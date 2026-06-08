"use client"

import { useMemo, useState } from "react"

import Prism from "prismjs"
import "prismjs/components/prism-css"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-typescript"

interface CodeBlockProps {
	code: string
	language?: string
	fileName?: string
	copyLabel?: string
}

export function CodeBlock({
	code,
	language = "jsx",
	fileName,
	copyLabel = "Copy code",
}: CodeBlockProps) {
	const [copied, setCopied] = useState(false)

	const html = useMemo(() => {
		const grammar = (Prism.languages[language] ||
			Prism.languages.javascript) as Prism.Grammar
		return Prism.highlight(code, grammar, language)
	}, [code, language])

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(code)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (error) {
			console.error("Failed to copy code: ", error)
		}
	}

	return (
		<div className="code-block-wrapper">
			{fileName ? (
				<div className="code-block-header">
					<span>{fileName}</span>
					<CopyButton copied={copied} label={copyLabel} onClick={handleCopy} />
				</div>
			) : (
				<CopyButton
					copied={copied}
					label={copyLabel}
					onClick={handleCopy}
					floating
				/>
			)}
			<pre className={`language-${language}`} tabIndex={0}>
				<code
					className={`language-${language}`}
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</pre>
		</div>
	)
}

function CopyButton({
	copied,
	label,
	onClick,
	floating = false,
}: {
	copied: boolean
	label: string
	onClick: () => void
	floating?: boolean
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={
				floating
					? "code-block-copy-btn ml-interaction-control"
					: "code-block-header__copy ml-interaction-control"
			}
			aria-label={copied ? "Copied" : label}
		>
			{copied ? <CheckIcon /> : <CopyIcon />}
			<span>{copied ? "Copied" : "Copy"}</span>
		</button>
	)
}

function CheckIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<polyline points="20 6 9 17 4 12" />
		</svg>
	)
}

function CopyIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
			<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
		</svg>
	)
}
