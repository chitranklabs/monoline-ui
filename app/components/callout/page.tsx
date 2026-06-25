import { createPageMetadata } from "../../lib/metadata"
import CalloutPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "Callout Component - monoline/ui reference",
	description:
		"API reference and variants for the monoline/ui Callout component, including note, tip, and warning types.",
	path: "/components/callout",
})

export default function CalloutPage() {
	return <CalloutPageClient />
}
