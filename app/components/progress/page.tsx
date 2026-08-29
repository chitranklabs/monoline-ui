import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import ProgressPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Progress React Component for Loading States | monoline/ui",
	description:
		"Learn how to use the monoline/ui Progress React component for determinate, indeterminate, and scroll-linked progress in articles and application workflows.",
	path: "/components/progress",
})

export default function ProgressPage() {
	return <ProgressPageClient />
}
