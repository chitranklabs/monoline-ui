import { createPageMetadata } from "../../lib/metadata"
import SegmentedControlPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "SegmentedControl Component - monoline/ui reference",
	description:
		"API reference for the monoline/ui SegmentedControl component - single-select group with a sliding indicator, available in default and pill variants.",
	path: "/components/segmented-control",
})

export default function SegmentedControlPage() {
	return <SegmentedControlPageClient />
}
