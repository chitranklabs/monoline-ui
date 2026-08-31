import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import TestimonialGridPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "TestimonialGrid React Layout Component | monoline/ui",
	description:
		"Learn how to use the monoline/ui TestimonialGrid React component to arrange testimonial cards in aligned grid or masonry layouts without JavaScript measurement.",
	path: "/docs/components/testimonial-grid",
})

export default function TestimonialGridPage() {
	return <TestimonialGridPageClient />
}
