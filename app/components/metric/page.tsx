import type { Metadata } from "next"

import MetricPageClient from "./client-page"

export const metadata: Metadata = {
	title: "Metric Component  monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui Metric component.",
	openGraph: {
		title: "Metric Component  monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui Metric component.",
	},
	twitter: {
		title: "Metric Component  monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui Metric component.",
	},
	alternates: {
		canonical: "/components/metric",
	},
}

export default function MetricPage() {
	return <MetricPageClient />
}
