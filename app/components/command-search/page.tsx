import { createPageMetadata } from "../../lib/metadata"
import CommandSearchPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "CommandSearch Component - monoline/ui reference",
	description:
		"API reference and interactive preview for the modal command palette and search component.",
	path: "/components/command-search",
})

export default function CommandSearchPage() {
	return <CommandSearchPageClient />
}
