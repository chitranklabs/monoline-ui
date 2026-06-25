import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import TestimonialGridPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "TestimonialGrid - monoline/ui component",
	description:
		"Arrange testimonial cards in aligned grid or masonry layouts without JavaScript measurement.",
	path: "/components/testimonial-grid",
})

export default function TestimonialGridPage() {
	return <TestimonialGridPageClient />
}
