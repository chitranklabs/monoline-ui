import { createPageMetadata } from "../../lib/metadata"
import RailPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "Rail Component - monoline/ui reference",
	description:
		"API reference and variants for the monoline/ui Rail component, offering sidebar list navigation styling.",
	path: "/components/rail",
})

export default function RailPage() {
	return <RailPageClient />
}
