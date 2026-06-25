import { createPageMetadata } from "../../lib/metadata"
import CardPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "Card Component  monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui Card component.",
	path: "/components/card",
})

export default function CardPage() {
	return <CardPageClient />
}
