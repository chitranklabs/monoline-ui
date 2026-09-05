import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import { componentPath } from "../../../lib/routes"
import CalloutPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Callout React Component for Notes and Warnings | monoline/ui",
	description:
		"Learn how to use the monoline/ui Callout React component to present notes, tips, and warnings with clear labels, semantic structure, and token-backed accents.",
	path: componentPath("callout"),
})

export default function CalloutPage() {
	return <CalloutPageClient />
}
