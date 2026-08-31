import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import { componentPath } from "../../../lib/routes"
import SegmentedControlPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "SegmentedControl React Input Component | monoline/ui Docs",
	description:
		"Learn how to use the monoline/ui SegmentedControl React component for accessible single-select input with roving keyboard focus and default or pill variants.",
	path: componentPath("segmented-control"),
})

export default function SegmentedControlPage() {
	return <SegmentedControlPageClient />
}
