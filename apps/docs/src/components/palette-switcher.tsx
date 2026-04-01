"use client"

import { themeModes } from "@chitrank2050/monoline-tokens"
import { Button, cn } from "@chitrank2050/monoline-ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"

function setAccentCookie(mode: string) {
	const maxAge = 365 * 24 * 60 * 60
	const value = `monoline-accent=${mode};path=/;max-age=${maxAge};samesite=lax`
	// biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API lacks broad support; document.cookie is the reliable cross-browser approach for setting cookies client-side.
	document.cookie = value
}

export function PaletteSwitcher({
	defaultAccent = "neutral",
}: {
	defaultAccent?: string
}) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const [accent, setAccent] = useState(
		() => searchParams.get("accent") || defaultAccent
	)

	const handleModeChange = useCallback(
		(mode: string) => {
			setAccent(mode)
			document.documentElement.dataset.accent = mode
			setAccentCookie(mode)

			const params = new URLSearchParams(searchParams.toString())
			params.set("accent", mode)
			router.replace(`${pathname}?${params.toString()}`, { scroll: false })
		},
		[router, pathname, searchParams]
	)

	return (
		<div className="flex flex-wrap gap-2">
			{themeModes.map((theme) => (
				<Button
					key={theme.id}
					type="button"
					size="sm"
					variant={accent === theme.id ? "default" : "outline"}
					className={cn(
						"rounded-full px-3",
						accent !== theme.id && "bg-transparent"
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
