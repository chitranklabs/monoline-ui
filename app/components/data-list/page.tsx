import { createPageMetadata } from "../../lib/metadata"
import DataListPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "DataList Component - monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui DataList component.",
	path: "/components/data-list",
})

export default function DataListPage() {
	return <DataListPageClient />
}
