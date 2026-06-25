import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import EditorialLinePageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "EditorialLine - monoline/ui component",
	description:
		"Render publication rows with index, date, title, summary, tag, and action metadata.",
	path: "/components/editorial-line",
})

export default function EditorialLinePage() {
	return <EditorialLinePageClient />
}
