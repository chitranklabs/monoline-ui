import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import ThemeSwitcherPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "ThemeSwitcher - monoline/ui component",
	description:
		"Render controlled light and dark theme controls in mini or full mode.",
	path: "/components/theme-switcher",
})

export default function ThemeSwitcherPage() {
	return <ThemeSwitcherPageClient />
}
