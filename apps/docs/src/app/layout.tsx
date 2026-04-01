import { cn } from "@chitrank2050/monoline-ui"
import type { Metadata } from "next"
import { Caveat, IBM_Plex_Mono, Inter, Manrope } from "next/font/google"
import { cookies } from "next/headers"
import Script from "next/script"

import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "../components/theme-provider"
import { siteConfig } from "../lib/site"

const inter = Inter({
	preload: true,
	subsets: ["latin"],
	display: "swap",
	adjustFontFallback: true,
	fallback: ["sans-serif"],
	variable: "--font-inter-sans",
})

const manrope = Manrope({
	preload: true,
	subsets: ["latin"],
	weight: ["700"],
	display: "swap",
	adjustFontFallback: true,
	fallback: ["sans-serif"],
	variable: "--font-headline",
})

const plexMono = IBM_Plex_Mono({
	preload: true,
	subsets: ["latin"],
	weight: ["400", "600", "700"],
	style: ["normal"],
	display: "swap",
	adjustFontFallback: true,
	fallback: ["monospace"],
	variable: "--font-plex-mono",
})

const caveat = Caveat({
	preload: true,
	subsets: ["latin"],
	display: "swap",
	adjustFontFallback: true,
	fallback: ["cursive"],
	variable: "--font-caveat-script",
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

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
	const cookieStore = await cookies()
	const accent = cookieStore.get("monoline-accent")?.value || "neutral"

	return (
		<html
			lang="en"
			suppressHydrationWarning
			data-accent={accent}
			className={cn(
				inter.variable,
				manrope.variable,
				plexMono.variable,
				caveat.variable
			)}
		>
			<head>
				<Script src="/accent-init.js" strategy="beforeInteractive" />
			</head>
			<body className="font-sans">
				<ThemeProvider>{children}</ThemeProvider>
				{isProduction && <Analytics />}
			</body>
		</html>
	)
}
