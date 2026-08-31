import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import FieldPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Accessible React Form Field Composition | monoline/ui",
	description:
		"Compose accessible React form fields with labels, controls, descriptions, required and disabled states, validation messages, and explicit ARIA relationships.",
	path: "/components/field",
})

export default function FieldPage() {
	return <FieldPageClient />
}
