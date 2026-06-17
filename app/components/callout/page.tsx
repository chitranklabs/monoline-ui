import type { Metadata } from "next"

import CalloutPageClient from "./client-page"

export const metadata: Metadata = {
	title: "Callout Component - monoline/ui reference",
	description:
		"API reference and variants for the monoline/ui Callout component, including note, tip, and warning types.",
	alternates: {
		canonical: "/components/callout",
	},
}

export default function CalloutPage() {
	return <CalloutPageClient />
}
