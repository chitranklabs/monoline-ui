import type { Metadata } from "next"

import StatusPageClient from "./client-page"

export const metadata: Metadata = {
	title: "Status Component  monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui Status component.",
	openGraph: {
		title: "Status Component  monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui Status component.",
	},
	twitter: {
		title: "Status Component  monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui Status component.",
	},
	alternates: {
		canonical: "/components/status",
	},
}

export default function StatusPage() {
	return <StatusPageClient />
}
