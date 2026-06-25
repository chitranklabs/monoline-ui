import { createPageMetadata } from "../../lib/metadata"
import ProgressPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "Progress Component  monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui Progress component.",
	path: "/components/progress",
})

export default function ProgressPage() {
	return <ProgressPageClient />
}
