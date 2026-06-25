import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import TestimonialPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Testimonial - monoline/ui component",
	description:
		"Render quotes with author metadata, avatar fallback, size, and surface variants.",
	path: "/components/testimonial",
})

export default function TestimonialPage() {
	return <TestimonialPageClient />
}
