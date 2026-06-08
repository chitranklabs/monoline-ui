import type { Metadata } from "next"

import TagPageClient from "./client-page"

export const metadata: Metadata = {
	title: "Tag Component - monoline/ui reference",
	description:
		"API reference for the monoline/ui Tag component, a token-backed filter pill with active state and count slot.",
	alternates: {
		canonical: "/components/tag",
	},
}

export default function TagPage() {
	return <TagPageClient />
}
