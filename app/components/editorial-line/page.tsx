import { createPageMetadata } from "../../lib/metadata"
import EditorialLinePageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "EditorialLine Component - monoline/ui reference",
	description:
		"API reference and layout styles for the monoline/ui EditorialLine component, ideal for rendering elegant publication article lists or blog rows.",
	path: "/components/editorial-line",
})

export default function EditorialLinePage() {
	return <EditorialLinePageClient />
}
