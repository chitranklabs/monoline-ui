import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import { componentPath } from "../../../lib/routes"
import EditorialLinePageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "EditorialLine React Publication Row | monoline/ui Docs",
	description:
		"Learn how to use the monoline/ui EditorialLine React component to render publication rows with an index, date, title, summary, tag, and action metadata.",
	path: componentPath("editorial-line"),
})

export default function EditorialLinePage() {
	return <EditorialLinePageClient />
}
