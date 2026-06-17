import type { Metadata } from "next"

import RailPageClient from "./client-page"

export const metadata: Metadata = {
	title: "Rail Component - monoline/ui reference",
	description:
		"API reference and variants for the monoline/ui Rail component, offering sidebar list navigation styling.",
	alternates: {
		canonical: "/components/rail",
	},
}

export default function RailPage() {
	return <RailPageClient />
}
