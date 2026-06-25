import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import CommandSearchPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "CommandSearch - monoline/ui component",
	description:
		"Build a modal command palette with grouped results, filtering, keyboard navigation, and optional shortcut.",
	path: "/components/command-search",
})

export default function CommandSearchPage() {
	return <CommandSearchPageClient />
}
