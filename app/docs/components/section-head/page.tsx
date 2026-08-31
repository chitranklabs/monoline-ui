import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import SectionHeadPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "SectionHead React Component for Page Intros | monoline/ui",
	description:
		"Learn how to use the monoline/ui SectionHead React component to create section introductions with an eyebrow, title, subtitle, and responsive type rhythm.",
	path: "/docs/components/section-head",
})

export default function SectionHeadPage() {
	return <SectionHeadPageClient />
}
