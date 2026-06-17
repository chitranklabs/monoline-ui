import type { Metadata } from "next"

import TocPageClient from "./client-page"

export const metadata: Metadata = {
	title: "Toc Component - monoline/ui reference",
	description:
		"API reference and variants for the monoline/ui Toc component, tracking dynamic headings scroll intersection.",
	alternates: {
		canonical: "/components/toc",
	},
}

export default function TocPage() {
	return <TocPageClient />
}
