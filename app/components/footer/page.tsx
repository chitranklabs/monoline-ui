import type { Metadata } from "next"

import FooterPageClient from "./client-page"

export const metadata: Metadata = {
	title: "Footer Component — monoline/ui reference",
	description:
		"API reference and layout configurations for the responsive monoline/ui Footer component, including newsletter forms.",
	openGraph: {
		title: "Footer Component — monoline/ui reference",
		description:
			"API reference and layout configurations for the responsive monoline/ui Footer component, including newsletter forms.",
	},
	twitter: {
		title: "Footer Component — monoline/ui reference",
		description:
			"API reference and layout configurations for the responsive monoline/ui Footer component, including newsletter forms.",
	},
	alternates: {
		canonical: "/components/footer",
	},
}

export default function FooterPage() {
	return <FooterPageClient />
}
