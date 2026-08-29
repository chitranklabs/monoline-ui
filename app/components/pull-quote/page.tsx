import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import PullQuotePageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "PullQuote React Component for Editorial Quotes | monoline/ui",
	description:
		"Learn how to use the monoline/ui PullQuote React component to highlight long-form quotations with optional attribution, semantic markup, and an accent border.",
	path: "/components/pull-quote",
})

export default function PullQuotePage() {
	return <PullQuotePageClient />
}
