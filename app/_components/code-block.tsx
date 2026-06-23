"use client"

import { useEffect, useState } from "react"

import Prism from "prismjs"
import "prismjs/components/prism-css"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-typescript"

import { Button } from "@chitrank2050/monoline-ui/button"

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
	// Start with null so server renders nothing in dangerouslySetInnerHTML,
	// then set highlighted HTML after hydration to avoid SSR/client mismatch.
	const [html, setHtml] = useState<string | null>(null)

	useEffect(() => {
		const grammar = (Prism.languages[language] ||
			Prism.languages.javascript) as Prism.Grammar
		setHtml(Prism.highlight(code, grammar, language))
	}, [code, language])

	const handleCopy = async () => {
		try {
			if (navigator.clipboard?.writeText && window.isSecureContext) {
				await navigator.clipboard.writeText(code)
			} else {
				const textarea = document.createElement("textarea")
				textarea.value = code
				textarea.setAttribute("readonly", "")
				textarea.style.position = "fixed"
				textarea.style.opacity = "0"
				document.body.appendChild(textarea)
				textarea.select()

				const copied = document.execCommand("copy")
				textarea.remove()

				if (!copied) {
					throw new Error("Copy command was not accepted")
				}
			}
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
			{/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
			<pre className={`language-${language}`} tabIndex={0}>
				{html !== null ? (
					<code
						className={`language-${language}`}
						dangerouslySetInnerHTML={{ __html: html }}
					/>
				) : (
					<code className={`language-${language}`}>{code}</code>
				)}
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
		<Button
			type="button"
			variant="secondary"
			size="sm"
			icon={floating}
			onClick={onClick}
			className={floating ? "code-block-copy-btn" : "code-block-header__copy"}
			aria-label={copied ? "Copied" : label}
		>
			<Button.Icon>{copied ? <CheckIcon /> : <CopyIcon />}</Button.Icon>
			<span className={floating ? "code-block-copy-btn__label" : undefined}>
				{copied ? "Copied" : "Copy"}
			</span>
		</Button>
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
