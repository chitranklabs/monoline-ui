import type { Metadata } from "next"

import SegmentedControlPageClient from "./client-page"

export const metadata: Metadata = {
	title: "SegmentedControl Component - monoline/ui reference",
	description:
		"API reference for the monoline/ui SegmentedControl component - single-select group with a sliding indicator, available in default and pill variants.",
	alternates: {
		canonical: "/components/segmented-control",
	},
}

export default function SegmentedControlPage() {
	return <SegmentedControlPageClient />
}
