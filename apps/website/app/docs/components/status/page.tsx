import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import { componentPath } from "../../../lib/routes"
import StatusPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Status React Component for State Labels | monoline/ui",
	description:
		"Learn how to use the monoline/ui Status React component to present compact state labels with a stable indicator dot, tone, and optional pulse animation.",
	path: componentPath("status"),
})

export default function StatusPage() {
	return <StatusPageClient />
}
