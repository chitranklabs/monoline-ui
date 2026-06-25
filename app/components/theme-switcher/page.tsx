import { createPageMetadata } from "../../lib/metadata"
import ThemeSwitcherPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "ThemeSwitcher Component  monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui ThemeSwitcher component, including mini and full modes.",
	path: "/components/theme-switcher",
})

export default function ThemeSwitcherPage() {
	return <ThemeSwitcherPageClient />
}
