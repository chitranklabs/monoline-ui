import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import BackLinkPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "BackLink React Navigation Component | monoline/ui Docs",
	description:
		"Learn how to use the monoline/ui BackLink React component for clear return navigation with a leading line, muted default state, and accent hover treatment.",
	path: "/docs/components/back-link",
})

export default function BackLinkPage() {
	return <BackLinkPageClient />
}
