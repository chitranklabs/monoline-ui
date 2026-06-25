import { createPageMetadata } from "../../lib/metadata"
import TestimonialGridPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "TestimonialGrid Component  monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui TestimonialGrid masonry layout component.",
	path: "/components/testimonial-grid",
})

export default function TestimonialGridPage() {
	return <TestimonialGridPageClient />
}
