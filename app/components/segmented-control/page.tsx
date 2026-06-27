import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import SegmentedControlPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "SegmentedControl - monoline/ui component",
	description:
		"Render single-select controls with roving keyboard focus and default or pill variants.",
	path: "/components/segmented-control",
})

export default function SegmentedControlPage() {
	return <SegmentedControlPageClient />
}
