import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import { componentPath } from "../../../lib/routes"
import FooterPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Footer React Component for Responsive Sites | monoline/ui",
	description:
		"Learn how to use the monoline/ui Footer React component to build responsive site footers with brand copy, link columns, subscription actions, and metadata rows.",
	path: componentPath("footer"),
})

export default function FooterPage() {
	return <FooterPageClient />
}
