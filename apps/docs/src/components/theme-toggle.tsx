"use client"

import { Button, cn } from "@chitrank2050/monoline-ui"
import { MoonStar, SunMedium } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const modes = [
	{ id: "light", label: "Light", icon: SunMedium },
	{ id: "dark", label: "Dark", icon: MoonStar },
] as const

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return (
			<div className="bg-muted inline-flex rounded-full p-1">
				{modes.map(({ id, label, icon: Icon }, index) => (
					<Button
						key={id}
						type="button"
						size="sm"
						variant={index === 0 ? "default" : "ghost"}
						className="rounded-full px-3"
					>
						<Icon className="size-4" />
						{label}
					</Button>
				))}
			</div>
		)
	}

	return (
		<div className="bg-muted inline-flex rounded-full p-1">
			{modes.map(({ id, label, icon: Icon }) => (
				<Button
					key={id}
					type="button"
					size="sm"
					variant={resolvedTheme === id ? "default" : "ghost"}
					className={cn(
						"rounded-full px-3",
						resolvedTheme !== id && "text-muted-foreground"
					)}
					onClick={() => setTheme(id)}
				>
					<Icon className="size-4" />
					{label}
				</Button>
			))}
		</div>
	)
}
