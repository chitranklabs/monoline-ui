import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import ResourcesPanelPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "ResourcesPanel - monoline/ui component",
	description:
		"List project resources such as live links, source, docs, files, and videos in a compact sidebar.",
	path: "/components/resources-panel",
})

export default function ResourcesPanelPage() {
	return <ResourcesPanelPageClient />
}
