import type { Metadata } from "next"

import DataListPageClient from "./client-page"

export const metadata: Metadata = {
	title: "DataList Component - monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui DataList component.",
	openGraph: {
		title: "DataList Component - monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui DataList component.",
	},
	twitter: {
		title: "DataList Component - monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui DataList component.",
	},
	alternates: {
		canonical: "/components/data-list",
	},
}

export default function DataListPage() {
	return <DataListPageClient />
}
