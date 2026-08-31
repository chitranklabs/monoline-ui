import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import SeparatorPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "React Separator Component for Content | monoline/ui Docs",
	description:
		"Divide React interface content horizontally or vertically with a decorative or semantic separator, orientation-aware ARIA behavior, and Monoline theme tokens.",
	path: "/components/separator",
})

export default function SeparatorPage() {
	return <SeparatorPageClient />
}
