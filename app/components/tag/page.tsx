import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import TagPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Tag for Interactive Filters and Categories | monoline/ui",
	description:
		"Use the monoline/ui Tag component for interactive filters and categories, with pressed state, count badges, prefix and suffix slots, and optional dismissal.",
	path: "/components/tag",
})

export default function TagPage() {
	return <TagPageClient />
}
