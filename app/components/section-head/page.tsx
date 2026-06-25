import { createPageMetadata } from "../../lib/metadata"
import SectionHeadPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "SectionHead Component  monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui SectionHead component.",
	path: "/components/section-head",
})

export default function SectionHeadPage() {
	return <SectionHeadPageClient />
}
