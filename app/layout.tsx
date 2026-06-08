import type { Metadata } from "next"

import "./globals.css"
import { SiteFooter } from "./_components/site-footer"
import { SiteHeader } from "./_components/site-header"
import { ThemeProvider } from "./_components/theme-provider"
import { monolineFontClassName } from "./lib/fonts"
import { siteUrl } from "./lib/seo"

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: "monoline/ui - Component library for personal sites & developer docs",
	description:
		"A Next.js docs and playground site for the Monoline UI component library.",
	alternates: {
		canonical: "/",
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang="en"
			data-theme="light"
			className={monolineFontClassName}
			suppressHydrationWarning
		>
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
