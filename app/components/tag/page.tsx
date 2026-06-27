import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import TagPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Tag - monoline/ui component",
	description:
		"Render filter buttons or quiet chips for categories, stacks, and metadata.",
	path: "/components/tag",
})

export default function TagPage() {
	return <TagPageClient />
}
