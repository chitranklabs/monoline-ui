import type { Metadata } from "next"

import CardPageClient from "./client-page"

export const metadata: Metadata = {
	title: "Card Component  monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui Card component.",
	openGraph: {
		title: "Card Component  monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui Card component.",
	},
	twitter: {
		title: "Card Component  monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui Card component.",
	},
	alternates: {
		canonical: "/components/card",
	},
}

export default function CardPage() {
	return <CardPageClient />
}
