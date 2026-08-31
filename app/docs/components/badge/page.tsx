import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import { componentPath } from "../../../lib/routes"
import BadgePageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Badge React Component for Status Labels | monoline/ui",
	description:
		"Learn how to use the monoline/ui Badge React component to label counts, statuses, and categories with compact sizing, variants, and token-based styling.",
	path: componentPath("badge"),
})

export default function BadgePage() {
	return <BadgePageClient />
}
