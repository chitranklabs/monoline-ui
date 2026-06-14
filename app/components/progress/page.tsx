import type { Metadata } from "next"

import ProgressPageClient from "./client-page"

export const metadata: Metadata = {
	title: "Progress Component  monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui Progress component.",
	openGraph: {
		title: "Progress Component  monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui Progress component.",
	},
	twitter: {
		title: "Progress Component  monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui Progress component.",
	},
	alternates: {
		canonical: "/components/progress",
	},
}

export default function ProgressPage() {
	return <ProgressPageClient />
}
