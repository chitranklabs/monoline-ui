import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import ResourcesPanelPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "ResourcesPanel React Project Links | monoline/ui Docs",
	description:
		"Learn how to use the monoline/ui ResourcesPanel React component to list live links, source code, documentation, files, and videos in a compact project sidebar.",
	path: "/components/resources-panel",
})

export default function ResourcesPanelPage() {
	return <ResourcesPanelPageClient />
}
