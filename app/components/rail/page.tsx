import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import RailPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Rail React Component for Sidebar Navigation | monoline/ui",
	description:
		"Learn how to use the monoline/ui Rail React component to render vertical navigation lists for sidebars, filters, secondary sections, and documentation.",
	path: "/components/rail",
})

export default function RailPage() {
	return <RailPageClient />
}
