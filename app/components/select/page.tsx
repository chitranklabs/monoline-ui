import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import SelectPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Select - monoline/ui component",
	description:
		"Render single-choice dropdowns for sorting, filtering, and view controls with mobile sheet behavior.",
	path: "/components/select",
})

export default function SelectPage() {
	return <SelectPageClient />
}
