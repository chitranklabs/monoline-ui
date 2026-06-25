import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import LinkListPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "LinkList - monoline/ui component",
	description:
		"Render compact resource and reading-list rows with dates, descriptions, and external-link handling.",
	path: "/components/link-list",
})

export default function LinkListPage() {
	return <LinkListPageClient />
}
