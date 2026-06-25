import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import TocPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Toc - monoline/ui component",
	description:
		"Render document outline links with active-section tracking and optional collapsible mode.",
	path: "/components/toc",
})

export default function TocPage() {
	return <TocPageClient />
}
