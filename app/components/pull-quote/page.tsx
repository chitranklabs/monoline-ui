import { createPageMetadata } from "../../lib/metadata"
import PullQuotePageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "PullQuote Component - monoline/ui reference",
	description:
		"API reference and variants for the monoline/ui PullQuote component, featuring custom attributions.",
	path: "/components/pull-quote",
})

export default function PullQuotePage() {
	return <PullQuotePageClient />
}
