import type { Metadata } from "next"

import ThemeSwitcherPageClient from "./client-page"

export const metadata: Metadata = {
	title: "ThemeSwitcher Component  monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui ThemeSwitcher component, including mini and full modes.",
	openGraph: {
		title: "ThemeSwitcher Component  monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui ThemeSwitcher component, including mini and full modes.",
	},
	twitter: {
		title: "ThemeSwitcher Component  monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui ThemeSwitcher component, including mini and full modes.",
	},
	alternates: {
		canonical: "/components/theme-switcher",
	},
}

export default function ThemeSwitcherPage() {
	return <ThemeSwitcherPageClient />
}
