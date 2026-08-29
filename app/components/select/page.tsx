import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import SelectPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Select React Dropdown Component for Forms | monoline/ui",
	description:
		"Learn how to use the monoline/ui Select React component for accessible single-choice dropdowns used in sorting, filtering, and responsive view controls.",
	path: "/components/select",
})

export default function SelectPage() {
	return <SelectPageClient />
}
