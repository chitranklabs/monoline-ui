import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import PullQuotePageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "PullQuote - monoline/ui component",
	description:
		"Highlight long-form quotes with optional attribution and an accent border.",
	path: "/components/pull-quote",
})

export default function PullQuotePage() {
	return <PullQuotePageClient />
}
