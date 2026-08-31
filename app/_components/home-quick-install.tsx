"use client"

import { useState } from "react"

import { Button } from "@chitrank2050/monoline-ui/button"

const installCommands = {
	npm: "npm i @chitrank2050/monoline-ui",
	pnpm: "pnpm add @chitrank2050/monoline-ui",
	bun: "bun add @chitrank2050/monoline-ui",
	yarn: "yarn add @chitrank2050/monoline-ui",
} as const

type PackageManager = keyof typeof installCommands

export function HomeQuickInstall() {
	const [manager, setManager] = useState<PackageManager>("npm")
	const [copied, setCopied] = useState(false)
	const command = installCommands[manager]

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(command)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (error) {
			console.error("Failed to copy command", error)
		}
	}

	return (
		<div className="inline-flex max-w-full flex-wrap items-center gap-1.5 border border-border rounded-lg bg-surface/90 p-1 shadow-xs transition-colors hover:border-border-strong">
			<div className="flex items-center gap-0.5 rounded-md bg-surface-2 p-0.5 font-mono text-3xs">
				{(["npm", "pnpm", "bun", "yarn"] as const).map((pm) => (
					<button
						key={pm}
						type="button"
						onClick={() => {
							setManager(pm)
							setCopied(false)
						}}
						className={`cursor-pointer rounded px-1.5 py-0.5 font-semibold transition-colors duration-(--duration-fast) ease-(--ease-out) ${
							manager === pm
								? "bg-surface text-text shadow-xs"
								: "text-text-muted hover:text-text"
						}`}
					>
						{pm}
					</button>
				))}
			</div>
			<code className="min-w-0 max-w-full truncate px-2 font-mono text-xs text-text-secondary select-all">
				{command}
			</code>
			<Button
				variant="secondary"
				size="sm"
				onClick={handleCopy}
				aria-label={copied ? "Copied" : "Copy install command"}
				className="h-7 shrink-0 px-2.5 text-xs"
			>
				{copied ? "Copied ✓" : "Copy"}
			</Button>
		</div>
	)
}
