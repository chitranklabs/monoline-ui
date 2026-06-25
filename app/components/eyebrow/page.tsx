import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import EyebrowPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Eyebrow - monoline/ui component",
	description:
		"Render compact section labels with mono text, uppercase rhythm, and predictable sizes.",
	path: "/components/eyebrow",
})

export default function EyebrowPage() {
	return <EyebrowPageClient />
}
