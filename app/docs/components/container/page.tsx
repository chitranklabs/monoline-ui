import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import ContainerPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Container React Layout Component | monoline/ui Docs",
	description:
		"Learn how to use the monoline/ui Container React component to constrain page content with responsive widths, spacing tokens, and semantic element overrides.",
	path: "/docs/components/container",
})

export default function ContainerPage() {
	return <ContainerPageClient />
}
