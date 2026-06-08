import type { Metadata } from "next"

import TestimonialPageClient from "./client-page"

export const metadata: Metadata = {
	title: "Testimonial Component  monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui Testimonial component.",
	openGraph: {
		title: "Testimonial Component  monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui Testimonial component.",
	},
	twitter: {
		title: "Testimonial Component  monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui Testimonial component.",
	},
	alternates: {
		canonical: "/components/testimonial",
	},
}

export default function TestimonialPage() {
	return <TestimonialPageClient />
}
