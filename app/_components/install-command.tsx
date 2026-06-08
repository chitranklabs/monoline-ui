"use client"

import { useMemo, useState } from "react"

const installCommands = {
	npm: "npm install @chitrank2050/monoline-ui",
	pnpm: "pnpm add @chitrank2050/monoline-ui",
	yarn: "yarn add @chitrank2050/monoline-ui",
	bun: "bun add @chitrank2050/monoline-ui",
} as const

type PackageManager = keyof typeof installCommands

const packageManagers = Object.keys(installCommands) as PackageManager[]

export function InstallCommand() {
	const [manager, setManager] = useState<PackageManager>("pnpm")
	const [copied, setCopied] = useState(false)
	const command = installCommands[manager]

	const commandWithPrompt = useMemo(() => `$ ${command}`, [command])

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(command)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (error) {
			console.error("Failed to copy install command: ", error)
		}
	}

	return (
		<div className="install-command">
			<div
				className="install-command__tabs"
				role="tablist"
				aria-label="Package manager"
			>
				{packageManagers.map((item) => (
					<button
						key={item}
						type="button"
						role="tab"
						aria-selected={item === manager}
						aria-pressed={item === manager}
						className="ml-interaction-tab"
						onClick={() => {
							setManager(item)
							setCopied(false)
						}}
					>
						{item}
					</button>
				))}
			</div>
			<div className="install-command__body">
				<code>{commandWithPrompt}</code>
				<button
					type="button"
					className="ml-interaction-control"
					onClick={handleCopy}
					aria-label={
						copied ? "Copied install command" : "Copy install command"
					}
				>
					{copied ? "Copied" : "Copy"}
				</button>
			</div>
		</div>
	)
}
