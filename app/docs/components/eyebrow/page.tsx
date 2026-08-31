import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import EyebrowPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Eyebrow React Component for Section Labels | monoline/ui",
	description:
		"Learn how to use the monoline/ui Eyebrow React component for compact section labels with monospaced text, uppercase rhythm, sizing, and design tokens.",
	path: "/docs/components/eyebrow",
})

export default function EyebrowPage() {
	return <EyebrowPageClient />
}
