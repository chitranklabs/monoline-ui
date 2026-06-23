import type { Metadata } from "next"

import CommandSearchPageClient from "./client-page"

export const metadata: Metadata = {
	title: "CommandSearch Component - monoline/ui reference",
	description:
		"API reference and interactive preview for the modal command palette and search component.",
	openGraph: {
		title: "CommandSearch Component - monoline/ui reference",
		description:
			"API reference and interactive preview for the modal command palette and search component.",
	},
	twitter: {
		title: "CommandSearch Component - monoline/ui reference",
		description:
			"API reference and interactive preview for the modal command palette and search component.",
	},
	alternates: {
		canonical: "/components/command-search",
	},
}

export default function CommandSearchPage() {
	return <CommandSearchPageClient />
}
