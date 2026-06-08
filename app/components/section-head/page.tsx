import type { Metadata } from "next"

import SectionHeadPageClient from "./client-page"

export const metadata: Metadata = {
	title: "SectionHead Component  monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui SectionHead component.",
	openGraph: {
		title: "SectionHead Component  monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui SectionHead component.",
	},
	twitter: {
		title: "SectionHead Component  monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui SectionHead component.",
	},
	alternates: {
		canonical: "/components/section-head",
	},
}

export default function SectionHeadPage() {
	return <SectionHeadPageClient />
}
