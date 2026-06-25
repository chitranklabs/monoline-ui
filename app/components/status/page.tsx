import { createPageMetadata } from "../../lib/metadata"
import StatusPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "Status Component  monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui Status component.",
	path: "/components/status",
})

export default function StatusPage() {
	return <StatusPageClient />
}
