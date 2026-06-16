import type { Metadata } from "next"

import LinkListPageClient from "./client-page"

export const metadata: Metadata = {
	title: "LinkList Component - monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui LinkList component.",
	openGraph: {
		title: "LinkList Component - monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui LinkList component.",
	},
	twitter: {
		title: "LinkList Component - monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui LinkList component.",
	},
	alternates: {
		canonical: "/components/link-list",
	},
}

export default function LinkListPage() {
	return <LinkListPageClient />
}
