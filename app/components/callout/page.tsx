import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import CalloutPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Callout - monoline/ui component",
	description:
		"Mark notes, tips, and warnings with clear labels and token-backed accents.",
	path: "/components/callout",
})

export default function CalloutPage() {
	return <CalloutPageClient />
}
