import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import MetricPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Metric React Component for Key Statistics | monoline/ui",
	description:
		"Learn how to use the monoline/ui Metric React component to present key numbers with clear labels, descriptions, optional trends, and token-based styling.",
	path: "/components/metric",
})

export default function MetricPage() {
	return <MetricPageClient />
}
