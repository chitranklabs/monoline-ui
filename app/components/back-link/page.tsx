import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import BackLinkPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "BackLink - monoline/ui component",
	description:
		"Render a compact return link with a leading line, muted default state, and accent hover treatment.",
	path: "/components/back-link",
})

export default function BackLinkPage() {
	return <BackLinkPageClient />
}
