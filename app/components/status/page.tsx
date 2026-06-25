import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import StatusPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Status - monoline/ui component",
	description:
		"Show compact state labels with a stable dot, tone, and optional pulse animation.",
	path: "/components/status",
})

export default function StatusPage() {
	return <StatusPageClient />
}
