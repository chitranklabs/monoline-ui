import type * as React from "react"

export type ThemeSwitcherTheme = "light" | "dark"
export type ThemeSwitcherMode = "mini" | "full"
export type ThemeSwitcherSize = "sm" | "md" | "lg"

export interface ThemeSwitcherProps extends Omit<
	React.ComponentPropsWithoutRef<"button">,
	"onChange"
> {
	theme: ThemeSwitcherTheme
	mode?: ThemeSwitcherMode
	size?: ThemeSwitcherSize
	onThemeChange: (theme: ThemeSwitcherTheme) => void
	lightLabel?: string
	darkLabel?: string
}
