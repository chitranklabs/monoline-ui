import { createPageMetadata } from "../../lib/metadata"
import TestimonialPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "Testimonial Component  monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui Testimonial component.",
	path: "/components/testimonial",
})

export default function TestimonialPage() {
	return <TestimonialPageClient />
}
