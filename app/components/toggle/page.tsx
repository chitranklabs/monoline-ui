import type { Metadata } from "next"

import TogglePageClient from "./client-page"

export const metadata: Metadata = {
	title: "Toggle Component — monoline/ui reference",
	description:
		"API reference for the monoline/ui Toggle component, a controlled or uncontrolled switch with token-backed motion.",
	alternates: {
		canonical: "/components/toggle",
	},
}

export default function TogglePage() {
	return <TogglePageClient />
}
