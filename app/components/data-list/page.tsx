import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import DataListPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "DataList - monoline/ui component",
	description:
		"Render structured rows for stats, timelines, metadata, and compact content.",
	path: "/components/data-list",
})

export default function DataListPage() {
	return <DataListPageClient />
}
