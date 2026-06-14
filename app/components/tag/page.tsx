import type { Metadata } from "next"

import TagPageClient from "./client-page"

export const metadata: Metadata = {
	title: "Tag Component - monoline/ui reference",
	description:
		"API reference for the monoline/ui Tag component, covering filter pills and quieter tech chips.",
	alternates: {
		canonical: "/components/tag",
	},
}

export default function TagPage() {
	return <TagPageClient />
}
