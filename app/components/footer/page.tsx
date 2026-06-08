import type { Metadata } from "next"

import FooterPageClient from "./client-page"

export const metadata: Metadata = {
	title: "Footer Component - monoline/ui reference",
	description:
		"API reference and layout configurations for the responsive monoline/ui Footer component, including link columns, metadata, and newsletter forms.",
	alternates: {
		canonical: "/components/footer",
	},
}

export default function FooterPage() {
	return <FooterPageClient />
}

