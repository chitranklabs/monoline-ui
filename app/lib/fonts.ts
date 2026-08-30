import { Caveat, IBM_Plex_Mono, Inter, Manrope } from "next/font/google"

const sansFont = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter-sans",
})

const monoFont = IBM_Plex_Mono({
	subsets: ["latin"],
	display: "swap",
	preload: false,
	weight: ["400", "500", "600", "700"],
	variable: "--font-plex-mono",
})

const scriptFont = Caveat({
	subsets: ["latin"],
	display: "swap",
	preload: false,
	weight: ["700"],
	variable: "--font-caveat-script",
})

const headlineFont = Manrope({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-manrope-headline",
})

export const monolineFontClassName = [
	sansFont.variable,
	monoFont.variable,
	scriptFont.variable,
	headlineFont.variable,
].join(" ")
