import { createPageMetadata } from "../../lib/metadata"
import ResourcesPanelPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "ResourcesPanel Component - monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui ResourcesPanel component.",
	path: "/components/resources-panel",
})

export default function ResourcesPanelPage() {
	return <ResourcesPanelPageClient />
}
