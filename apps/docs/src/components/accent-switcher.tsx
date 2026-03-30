"use client"

import { accentThemes } from "@foundry/tokens"
import { Button, cn } from "@foundry/ui"
import { useEffect, useState } from "react"

const storageKey = "foundry-accent"

export function AccentSwitcher() {
	const [activeAccent, setActiveAccent] = useState("copper")

	useEffect(() => {
		const savedAccent = window.localStorage.getItem(storageKey)
		if (savedAccent) {
			setActiveAccent(savedAccent)
			document.documentElement.dataset.accent = savedAccent
			return
		}

		document.documentElement.dataset.accent = "copper"
	}, [])

	const handleAccentChange = (accent: string) => {
		setActiveAccent(accent)
		document.documentElement.dataset.accent = accent
		window.localStorage.setItem(storageKey, accent)
	}

	return (
		<div className="flex flex-wrap gap-2">
			{accentThemes.map((theme) => (
				<Button
					key={theme.id}
					type="button"
					size="sm"
					variant={activeAccent === theme.id ? "default" : "outline"}
					className={cn(
						"rounded-full px-3",
						activeAccent !== theme.id && "bg-transparent"
					)}
					onClick={() => handleAccentChange(theme.id)}
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
