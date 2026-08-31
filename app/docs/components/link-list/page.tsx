import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import LinkListPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "LinkList React Component for Resource Lists | monoline/ui",
	description:
		"Learn how to use the monoline/ui LinkList React component to render resource and reading-list rows with dates, descriptions, and external-link handling.",
	path: "/docs/components/link-list",
})

export default function LinkListPage() {
	return <LinkListPageClient />
}
