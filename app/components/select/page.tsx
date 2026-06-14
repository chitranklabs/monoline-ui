import type { Metadata } from "next"

import SelectPageClient from "./client-page"

export const metadata: Metadata = {
	title: "Select Component - monoline/ui reference",
	description:
		"API reference for the monoline/ui Select component for sorting, filtering, and compact single-choice controls.",
	alternates: {
		canonical: "/components/select",
	},
}

export default function SelectPage() {
	return <SelectPageClient />
}
