import { createPageMetadata } from "../../lib/metadata"
import SelectPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "Select Component - monoline/ui reference",
	description:
		"API reference for the monoline/ui Select component for sorting, filtering, and compact single-choice controls.",
	path: "/components/select",
})

export default function SelectPage() {
	return <SelectPageClient />
}
