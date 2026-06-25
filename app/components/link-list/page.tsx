import { createPageMetadata } from "../../lib/metadata"
import LinkListPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "LinkList Component - monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui LinkList component.",
	path: "/components/link-list",
})

export default function LinkListPage() {
	return <LinkListPageClient />
}
