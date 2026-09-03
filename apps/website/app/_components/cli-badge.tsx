"use client"

import { useState } from "react"

import { track } from "@vercel/analytics"

import { Button } from "@chitrank2050/monoline-ui/button"

export function CliBadge() {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText("npm i @chitrank2050/monoline-ui")
			track("install_command_copied", { packageManager: "npm" })
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error("Failed to copy CLI command: ", err)
		}
	}

	return (
		<Button
			type="button"
			variant="secondary"
			size="md"
			onClick={handleCopy}
			className="font-mono text-xs"
			aria-label={copied ? "Copied command" : "Copy installation command"}
		>
			<span className="font-bold text-accent">$</span>
			<span className="[user-select:all]">npm i @chitrank2050/monoline-ui</span>
			<span className="flex size-3.5 items-center justify-center text-text-muted transition-colors duration-(--duration-short) ease-out-expo">
				{copied ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="animate-scale-in size-full text-accent"
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
						className="size-full"
					>
						<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
						<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
					</svg>
				)}
			</span>
		</Button>
	)
}
