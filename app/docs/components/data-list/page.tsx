import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import { componentPath } from "../../../lib/routes"
import DataListPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "DataList React Component for Structured Rows | monoline/ui",
	description:
		"Learn how to use the monoline/ui DataList React component to render structured rows for statistics, timelines, metadata, and compact editorial content.",
	path: componentPath("data-list"),
})

export default function DataListPage() {
	return <DataListPageClient />
}
