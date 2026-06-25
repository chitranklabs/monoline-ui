import { createPageMetadata } from "../../lib/metadata"
import MetricPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "Metric Component  monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui Metric component.",
	path: "/components/metric",
})

export default function MetricPage() {
	return <MetricPageClient />
}
