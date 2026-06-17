import type { Metadata } from "next"

import BadgePageClient from "./client-page"

export const metadata: Metadata = {
	title: "Badge Component - monoline/ui reference",
	description:
		"API reference and variants for the monoline/ui Badge component, including solid, outline, muted, and accent variations.",
	alternates: {
		canonical: "/components/badge",
	},
}

export default function BadgePage() {
	return <BadgePageClient />
}
