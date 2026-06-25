import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import MetricPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Metric - monoline/ui component",
	description:
		"Show key numbers with labels, descriptions, and optional trend state.",
	path: "/components/metric",
})

export default function MetricPage() {
	return <MetricPageClient />
}
