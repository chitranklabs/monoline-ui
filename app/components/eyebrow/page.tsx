import type { Metadata } from "next"

import EyebrowPageClient from "./client-page"

export const metadata: Metadata = {
	title: "Eyebrow Component  monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui Eyebrow component.",
	openGraph: {
		title: "Eyebrow Component  monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui Eyebrow component.",
	},
	twitter: {
		title: "Eyebrow Component  monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui Eyebrow component.",
	},
	alternates: {
		canonical: "/components/eyebrow",
	},
}

export default function EyebrowPage() {
	return <EyebrowPageClient />
}
