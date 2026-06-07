"use client"

import { useState } from "react"

export function CliBadge() {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText("npm i @chitrank2050/monoline-ui")
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error("Failed to copy CLI command: ", err)
		}
	}

	return (
		<button
			type="button"
			onClick={handleCopy}
			className="cli-badge ml-interaction-control"
			aria-label={copied ? "Copied command" : "Copy installation command"}
		>
			<span className="cli-badge__prefix">$</span>
			<span className="cli-badge__code">npm i @chitrank2050/monoline-ui</span>
			<span className="cli-badge__icon">
				{copied ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="cli-badge__svg cli-badge__svg--success"
					>
						<polyline points="20 6 9 17 4 12" />
					</svg>
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="cli-badge__svg"
					>
						<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
						<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
					</svg>
				)}
			</span>
		</button>
	)
}
