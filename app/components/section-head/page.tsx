import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import SectionHeadPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "SectionHead - monoline/ui component",
	description:
		"Create section intros with eyebrow, title, subtitle, and size-based heading rhythm.",
	path: "/components/section-head",
})

export default function SectionHeadPage() {
	return <SectionHeadPageClient />
}
