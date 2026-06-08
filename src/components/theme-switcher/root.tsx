"use client"

import { cn } from "../../lib/utils"
import { Button } from "../button"
import { Toggle } from "../toggle"
import type { ThemeSwitcherProps, ThemeSwitcherSize } from "./types"

const fullSizeToToggleSize: Record<ThemeSwitcherSize, "sm" | "md" | "lg"> = {
	sm: "sm",
	md: "md",
	lg: "lg",
}

export function ThemeSwitcherRoot({
	className,
	theme,
	mode = "mini",
	size = "md",
	onThemeChange,
	lightLabel = "Switch to light theme",
	darkLabel = "Switch to dark theme",
	type,
	...props
}: ThemeSwitcherProps) {
	const isDark = theme === "dark"
	const nextTheme = isDark ? "light" : "dark"
	const ariaLabel = isDark ? lightLabel : darkLabel

	if (mode === "full") {
		return (
			<div
				className={cn("ml-theme-switcher ml-theme-switcher--full", className)}
				data-theme-value={theme}
				data-size={size}
			>
				<span className="ml-theme-switcher__icon" aria-hidden="true">
					☼
				</span>
				<Toggle
					className="ml-theme-switcher__toggle"
					size={fullSizeToToggleSize[size]}
					checked={isDark}
					aria-label={ariaLabel}
					onCheckedChange={(checked) =>
						onThemeChange(checked ? "dark" : "light")
					}
				/>
				<span className="ml-theme-switcher__icon" aria-hidden="true">
					☾
				</span>
			</div>
		)
	}

	return (
		<Button
			type={type ?? "button"}
			variant="secondary"
			size={size}
			icon
			className={cn("ml-theme-switcher ml-theme-switcher--mini", className)}
			data-theme-value={theme}
			data-size={size}
			aria-label={ariaLabel}
			onClick={() => onThemeChange(nextTheme)}
			{...props}
		>
			<span className="ml-theme-switcher__icon" aria-hidden="true">
				{isDark ? "☾" : "☼"}
			</span>
		</Button>
	)
}
