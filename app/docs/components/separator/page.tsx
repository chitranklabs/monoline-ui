import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import { componentPath } from "../../../lib/routes"
import SeparatorPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "React Separator Component for Content | monoline/ui Docs",
	description:
		"Divide React interface content horizontally or vertically with a decorative or semantic separator, orientation-aware ARIA behavior, and Monoline theme tokens.",
	path: componentPath("separator"),
})

export default function SeparatorPage() {
	return <SeparatorPageClient />
}
