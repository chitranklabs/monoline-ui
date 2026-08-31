import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import { componentPath } from "../../../lib/routes"
import TagPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Tag for Interactive Filters and Categories | monoline/ui",
	description:
		"Use the monoline/ui Tag component for interactive filters and categories, with pressed state, count badges, prefix and suffix slots, and optional dismissal.",
	path: componentPath("tag"),
})

export default function TagPage() {
	return <TagPageClient />
}
