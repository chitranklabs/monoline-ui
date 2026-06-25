import { createPageMetadata } from "../../lib/metadata"
import TocPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "Toc Component - monoline/ui reference",
	description:
		"API reference and variants for the monoline/ui Toc component, tracking dynamic headings scroll intersection.",
	path: "/components/toc",
})

export default function TocPage() {
	return <TocPageClient />
}
