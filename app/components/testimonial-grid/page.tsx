import type { Metadata } from "next"

import TestimonialGridPageClient from "./client-page"

export const metadata: Metadata = {
	title: "TestimonialGrid Component  monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui TestimonialGrid masonry layout component.",
	openGraph: {
		title: "TestimonialGrid Component  monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui TestimonialGrid masonry layout component.",
	},
	twitter: {
		title: "TestimonialGrid Component  monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui TestimonialGrid masonry layout component.",
	},
	alternates: {
		canonical: "/components/testimonial-grid",
	},
}

export default function TestimonialGridPage() {
	return <TestimonialGridPageClient />
}
