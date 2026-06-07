import type { Metadata } from "next"

import "./globals.css"
import { SiteFooter } from "./_components/site-footer"
import { SiteHeader } from "./_components/site-header"
import { ThemeProvider } from "./_components/theme-provider"
import { monolineFontClassName } from "./lib/fonts"

export const metadata: Metadata = {
	title: "monoline/ui — Component library for personal sites & developer docs",
	description:
		"A Next.js docs and playground site for the Monoline UI component library.",
}

/**
 * Runs synchronously before React hydrates — reads localStorage then
 * prefers-color-scheme and sets data-theme on <html> in one tick.
 * Wrapped in try/catch so SSR (where localStorage is absent) never throws.
 */
const themeInitScript = `(function(){try{var t=localStorage.getItem('ml-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}else if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.setAttribute('data-theme','dark');}else{document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className={monolineFontClassName} suppressHydrationWarning>
			<head>
				{/* Blocking theme init — must be first in <head> to prevent FOUC */}
				<script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
			</head>
			<body>
				<ThemeProvider>
					<div className="min-h-screen bg-background">
						<SiteHeader />
						{children}
						<SiteFooter />
					</div>
				</ThemeProvider>
			</body>
		</html>
	)
}
