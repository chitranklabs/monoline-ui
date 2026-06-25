import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import TogglePageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Toggle - monoline/ui component",
	description:
		"Render controlled or uncontrolled switches with role=switch semantics and token-backed motion.",
	path: "/components/toggle",
})

export default function TogglePage() {
	return <TogglePageClient />
}
