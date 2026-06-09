"use client"

import { useMemo, useState } from "react"

import { Button } from "@chitrank2050/monoline-ui/button"
import { SegmentedControl } from "@chitrank2050/monoline-ui/segmented-control"

const installCommands = {
	npm: "npm install @chitrank2050/monoline-ui",
	pnpm: "pnpm add @chitrank2050/monoline-ui",
	yarn: "yarn add @chitrank2050/monoline-ui",
	bun: "bun add @chitrank2050/monoline-ui",
} as const

type PackageManager = keyof typeof installCommands

const packageManagers = Object.keys(installCommands) as PackageManager[]
const packageManagerOptions = packageManagers.map((value) => ({
	value,
	label: value,
}))

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
			<SegmentedControl
				className="install-command__tabs"
				size="sm"
				options={packageManagerOptions}
				value={manager}
				onChange={(value) => {
					setManager(value)
					setCopied(false)
				}}
			/>
			<div className="install-command__body">
				<code>{commandWithPrompt}</code>
				<Button
					type="button"
					variant="secondary"
					size="sm"
					onClick={handleCopy}
					aria-label={
						copied ? "Copied install command" : "Copy install command"
					}
				>
					{copied ? "Copied" : "Copy"}
				</Button>
			</div>
		</div>
	)
}
