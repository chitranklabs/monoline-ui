import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import BadgePageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Badge - monoline/ui component",
	description:
		"Label counts, statuses, and categories with compact size and variant controls.",
	path: "/components/badge",
})

export default function BadgePage() {
	return <BadgePageClient />
}
