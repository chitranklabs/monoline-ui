import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import { componentPath } from "../../../lib/routes"
import ThemeSwitcherPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "ThemeSwitcher React Theme Control | monoline/ui Docs",
	description:
		"Learn how to use the monoline/ui ThemeSwitcher React component to provide accessible controlled light and dark theme controls in compact or full layouts.",
	path: componentPath("theme-switcher"),
})

export default function ThemeSwitcherPage() {
	return <ThemeSwitcherPageClient />
}
