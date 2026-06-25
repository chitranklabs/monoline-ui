import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import RailPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Rail - monoline/ui component",
	description:
		"Render vertical navigation lists for sidebars, filters, and secondary sections.",
	path: "/components/rail",
})

export default function RailPage() {
	return <RailPageClient />
}
