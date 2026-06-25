import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import ContainerPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Container - monoline/ui component",
	description:
		"Constrain page content with responsive max widths, horizontal padding tokens, and semantic element overrides.",
	path: "/components/container",
})

export default function ContainerPage() {
	return <ContainerPageClient />
}
