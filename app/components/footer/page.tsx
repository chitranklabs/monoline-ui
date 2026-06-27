import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import FooterPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Footer - monoline/ui component",
	description:
		"Build responsive site footers with brand copy, link columns, subscribe actions, and meta rows.",
	path: "/components/footer",
})

export default function FooterPage() {
	return <FooterPageClient />
}
