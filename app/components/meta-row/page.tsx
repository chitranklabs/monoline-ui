import type { Metadata } from "next"

import MetaRowPageClient from "./client-page"

export const metadata: Metadata = {
	title: "MetaRow Component - monoline/ui reference",
	description:
		"API reference and layout styles for the monoline/ui MetaRow component, showing horizontal arrays of monospace meta details with delimiters.",
	alternates: {
		canonical: "/components/meta-row",
	},
}

export default function MetaRowPage() {
	return <MetaRowPageClient />
}
