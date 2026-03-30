import { cn } from "@chitrank2050/monoline-ui"
import type { Metadata } from "next"
import { Caveat, IBM_Plex_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "../components/theme-provider"
import { siteConfig } from "../lib/site"

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
	display: "swap",
})

const plexMono = IBM_Plex_Mono({
	subsets: ["latin"],
	weight: ["400", "500", "600"],
	variable: "--font-mono",
	display: "swap",
})

const caveat = Caveat({
	subsets: ["latin"],
	variable: "--font-script",
	display: "swap",
})

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: siteConfig.name,
	description: siteConfig.description,
	openGraph: {
		title: siteConfig.name,
		description: siteConfig.description,
		url: siteConfig.url,
		siteName: siteConfig.name,
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.name,
		description: siteConfig.description,
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
			suppressHydrationWarning
			className={cn(inter.variable, plexMono.variable, caveat.variable)}
		>
			<body className="font-sans">
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	)
}
