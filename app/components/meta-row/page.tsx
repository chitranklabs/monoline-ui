import { createPageMetadata } from "../../lib/metadata"
import MetaRowPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "MetaRow Component - monoline/ui reference",
	description:
		"API reference and layout styles for the monoline/ui MetaRow component, showing horizontal arrays of monospace meta details with delimiters.",
	path: "/components/meta-row",
})

export default function MetaRowPage() {
	return <MetaRowPageClient />
}
