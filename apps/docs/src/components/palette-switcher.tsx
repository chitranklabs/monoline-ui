"use client"

import { themeModes } from "@chitrank2050/monoline-tokens"
import { Button, cn } from "@chitrank2050/monoline-ui"
import { useEffect, useState } from "react"

const storageKey = "monoline-theme-mode"

export function PaletteSwitcher() {
	const [activeMode, setActiveMode] = useState("neutral")

	useEffect(() => {
		const savedMode = window.localStorage.getItem(storageKey)
		if (savedMode) {
			setActiveMode(savedMode)
			document.documentElement.dataset.accent = savedMode
			return
		}

		document.documentElement.dataset.accent = "neutral"
	}, [])

	const handleModeChange = (mode: string) => {
		setActiveMode(mode)
		document.documentElement.dataset.accent = mode
		window.localStorage.setItem(storageKey, mode)
	}

	return (
		<div className="flex flex-wrap gap-2">
			{themeModes.map((theme) => (
				<Button
					key={theme.id}
					type="button"
					size="sm"
					variant={activeMode === theme.id ? "default" : "outline"}
					className={cn(
						"rounded-full px-3",
						activeMode !== theme.id && "bg-transparent"
					)}
					onClick={() => handleModeChange(theme.id)}
				>
					<span
						className="size-2.5 rounded-full"
						style={{ backgroundColor: theme.swatches[0] }}
					/>
					{theme.label}
				</Button>
			))}
		</div>
	)
}
