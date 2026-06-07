"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

type ThemeContextType = {
	theme: Theme
	toggleTheme: () => void
	setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>("light")

	// Sync state with DOM attribute set by blocking script on mount
	useEffect(() => {
		const initialTheme = document.documentElement.getAttribute("data-theme") as Theme | null
		if (initialTheme) {
			setTheme(initialTheme)
		} else {
			const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
			setTheme(isDark ? "dark" : "light")
		}
	}, [])

	const handleSetTheme = (newTheme: Theme) => {
		setTheme(newTheme)
		document.documentElement.setAttribute("data-theme", newTheme)
		localStorage.setItem("ml-theme", newTheme)
	}

	const toggleTheme = () => {
		handleSetTheme(theme === "light" ? "dark" : "light")
	}

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme, setTheme: handleSetTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export function useTheme() {
	const context = useContext(ThemeContext)
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider")
	}
	return context
}
