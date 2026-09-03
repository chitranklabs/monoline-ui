"use client"

import React, { createContext, use, useEffect, useState } from "react"

type Theme = "light" | "dark"

type ThemeContextType = {
	theme: Theme
	toggleTheme: () => void
	setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = "ml-theme"
const THEME_TRANSITION_DURATION_MS = 250

function readDocumentTheme(): Theme {
	return document.documentElement.getAttribute("data-theme") === "dark"
		? "dark"
		: "light"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>("light")

	useEffect(() => {
		setTheme(readDocumentTheme())
	}, [])

	const handleSetTheme = (newTheme: Theme) => {
		document.documentElement.classList.add("theme-transitioning")
		setTheme(newTheme)
		document.documentElement.setAttribute("data-theme", newTheme)
		try {
			localStorage.setItem(THEME_STORAGE_KEY, newTheme)
		} catch {
			// Private browsing or locked storage should not block theme changes.
		}
		setTimeout(() => {
			document.documentElement.classList.remove("theme-transitioning")
		}, THEME_TRANSITION_DURATION_MS)
	}

	const toggleTheme = () => {
		const nextTheme = theme === "light" ? "dark" : "light"
		handleSetTheme(nextTheme)
	}

	return (
		<ThemeContext.Provider
			value={{ theme, toggleTheme, setTheme: handleSetTheme }}
		>
			{children}
		</ThemeContext.Provider>
	)
}

export function useTheme() {
	const context = use(ThemeContext)
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider")
	}
	return context
}
