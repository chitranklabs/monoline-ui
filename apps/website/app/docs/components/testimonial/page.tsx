import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import { componentPath } from "../../../lib/routes"
import TestimonialPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Testimonial React Quote Component | monoline/ui Docs",
	description:
		"Learn how to use the monoline/ui Testimonial React component to present quotes with author metadata, avatar fallbacks, responsive sizing, and surface variants.",
	path: componentPath("testimonial"),
})

export default function TestimonialPage() {
	return <TestimonialPageClient />
}
