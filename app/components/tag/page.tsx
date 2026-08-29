import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import TagPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Tag React Component for Filters and Metadata | monoline/ui",
	description:
		"Learn how to use the monoline/ui Tag React component to create filter buttons or quiet chips for categories, technology stacks, and editorial metadata.",
	path: "/components/tag",
})

export default function TagPage() {
	return <TagPageClient />
}
