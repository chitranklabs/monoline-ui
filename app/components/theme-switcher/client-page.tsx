"use client"

import { useState } from "react"

import {
	ThemeSwitcher,
	type ThemeSwitcherSize,
	type ThemeSwitcherTheme,
} from "@chitrank2050/monoline-ui/theme-switcher"

import { ComponentPlayground } from "../../_components/component-playground"

const themeSwitcherSizes: ThemeSwitcherSize[] = ["sm", "md", "lg"]

const usageCode = `const [theme, setTheme] = useState<"light" | "dark">("light")

<ThemeSwitcher
  mode="mini"
  theme={theme}
  onThemeChange={setTheme}
/>

<ThemeSwitcher
  mode="full"
  theme={theme}
  onThemeChange={setTheme}
/>`

const sourceSnippet = `import { ThemeSwitcher } from "@chitrank2050/monoline-ui/theme-switcher"

export function ThemeControl() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  return (
    <ThemeSwitcher
      mode="full"
      theme={theme}
      onThemeChange={setTheme}
    />
  )
}`

const propsRows = [
	["theme", "light | dark", "Controlled theme value"],
	["onThemeChange", "(theme) => void", "Theme change callback"],
	[
		"mode",
		"mini | full",
		"Compact icon button or full sun/toggle/moon control",
	],
	["size", "sm | md | lg", "Switcher scale"],
	["lightLabel", "string", "Accessible label when switching to light"],
	["darkLabel", "string", "Accessible label when switching to dark"],
] as const

const tokenRows = [
	["--duration-medium", "Toggle track and thumb transition duration"],
	["--ease-spring", "Thumb movement easing"],
	["--accent / --accent-soft", "Full-mode active track palette"],
	["--focus-ring", "Keyboard focus state"],
] as const

export default function ThemeSwitcherPageClient() {
	const [theme, setTheme] = useState<ThemeSwitcherTheme>("light")

	return (
		<ComponentPlayground<ThemeSwitcherSize>
			title="ThemeSwitcher"
			description="Render a controlled theme switcher in compact mini mode or full sun/toggle/moon mode. The component owns visuals and motion; apps only provide theme state."
			sizes={themeSwitcherSizes}
			defaultSize="md"
			importStatement='import { ThemeSwitcher } from "@chitrank2050/monoline-ui/theme-switcher"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(size = "md") => (
				<div className="flex flex-wrap items-center gap-ml-6 p-ml-6">
					<ThemeSwitcher
						size={size}
						mode="mini"
						theme={theme}
						onThemeChange={setTheme}
					/>
					<ThemeSwitcher
						size={size}
						mode="full"
						theme={theme}
						onThemeChange={setTheme}
					/>
				</div>
			)}
		/>
	)
}
