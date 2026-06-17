import type { Metadata } from "next"

import PullQuotePageClient from "./client-page"

export const metadata: Metadata = {
	title: "PullQuote Component - monoline/ui reference",
	description:
		"API reference and variants for the monoline/ui PullQuote component, featuring custom attributions.",
	alternates: {
		canonical: "/components/pull-quote",
	},
}

export default function PullQuotePage() {
	return <PullQuotePageClient />
}
