import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import TagPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Tag for Interactive Filters and Categories | monoline/ui",
	description:
		"Learn how to use the monoline/ui Tag component to create interactive filter buttons and category toggles with count badges.",
	path: "/components/tag",
})

export default function TagPage() {
	return <TagPageClient />
}
