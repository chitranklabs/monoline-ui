"use client"

import {
	ThemeSwitcher,
	type ThemeSwitcherMode,
	type ThemeSwitcherSize,
} from "@chitrank2050/monoline-ui/theme-switcher"

import { useTheme } from "./theme-provider"

export function ThemeControl({
	mode = "mini",
	size = "md",
	className,
}: {
	mode?: ThemeSwitcherMode
	size?: ThemeSwitcherSize
	className?: string
}) {
	const { theme, setTheme } = useTheme()

	return (
		<ThemeSwitcher
			mode={mode}
			size={size}
			theme={theme}
			onThemeChange={setTheme}
			className={className}
		/>
	)
}
