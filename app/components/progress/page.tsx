import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import ProgressPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Progress - monoline/ui component",
	description:
		"Show determinate, indeterminate, or scroll-following progress bars for articles and workflows.",
	path: "/components/progress",
})

export default function ProgressPage() {
	return <ProgressPageClient />
}
