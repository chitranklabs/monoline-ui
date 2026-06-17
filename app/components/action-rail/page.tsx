import type { Metadata } from "next"

import ActionRailPageClient from "./client-page"

export const metadata: Metadata = {
	title: "ActionRail Component - monoline/ui reference",
	description:
		"API reference and variants for the monoline/ui ActionRail component, providing layouts for social links or toolbar actions.",
	alternates: {
		canonical: "/components/action-rail",
	},
}

export default function ActionRailPage() {
	return <ActionRailPageClient />
}
