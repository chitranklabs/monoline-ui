"use client"

import Script from "next/script"
import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

type ThemeContextType = {
	theme: Theme
	toggleTheme: () => void
	setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = "ml-theme"
const THEME_TRANSITION_DURATION_MS = 250

const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');var d=document.documentElement;if(t==='light'||t==='dark'){d.setAttribute('data-theme',t);return;}if(window.matchMedia('(prefers-color-scheme: dark)').matches){d.setAttribute('data-theme','dark');return;}d.setAttribute('data-theme','light');}catch(e){}})();`

function readDocumentTheme(): Theme {
	return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>("light")

	useEffect(() => {
		setTheme(readDocumentTheme())
	}, [])

	const handleSetTheme = (newTheme: Theme) => {
		setTheme(newTheme)
		document.documentElement.setAttribute("data-theme", newTheme)
		try {
			localStorage.setItem(THEME_STORAGE_KEY, newTheme)
		} catch {
			// Private browsing or locked storage should not block theme changes.
		}
	}

	const toggleTheme = () => {
		const nextTheme = theme === "light" ? "dark" : "light"
		document.documentElement.classList.add("theme-transitioning")
		handleSetTheme(nextTheme)
		setTimeout(() => {
			document.documentElement.classList.remove("theme-transitioning")
		}, THEME_TRANSITION_DURATION_MS)
	}

	return (
		<>
			<Script
				id="monoline-theme-init"
				strategy="beforeInteractive"
				dangerouslySetInnerHTML={{ __html: themeInitScript }}
			/>
			<ThemeContext.Provider value={{ theme, toggleTheme, setTheme: handleSetTheme }}>
				{children}
			</ThemeContext.Provider>
		</>
	)
}

export function useTheme() {
	const context = useContext(ThemeContext)
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider")
	}
	return context
}
