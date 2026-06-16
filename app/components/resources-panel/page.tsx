import type { Metadata } from "next"

import ResourcesPanelPageClient from "./client-page"

export const metadata: Metadata = {
	title: "ResourcesPanel Component - monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui ResourcesPanel component.",
	openGraph: {
		title: "ResourcesPanel Component - monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui ResourcesPanel component.",
	},
	twitter: {
		title: "ResourcesPanel Component - monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui ResourcesPanel component.",
	},
}

export default function ResourcesPanelPage() {
	return <ResourcesPanelPageClient />
}
