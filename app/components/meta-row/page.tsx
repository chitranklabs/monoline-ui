import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import MetaRowPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "MetaRow - monoline/ui component",
	description:
		"Render small inline metadata groups with mono text and separators.",
	path: "/components/meta-row",
})

export default function MetaRowPage() {
	return <MetaRowPageClient />
}
