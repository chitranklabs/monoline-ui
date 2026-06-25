import { createPageMetadata } from "../../lib/metadata"
import EyebrowPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "Eyebrow Component  monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui Eyebrow component.",
	path: "/components/eyebrow",
})

export default function EyebrowPage() {
	return <EyebrowPageClient />
}
