import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import { componentPath } from "../../../lib/routes"
import TocPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Table of Contents React Component | monoline/ui Docs",
	description:
		"Learn how to use the monoline/ui table of contents React component to render document outline links with active-section tracking and collapsible behavior.",
	path: componentPath("toc"),
})

export default function TocPage() {
	return <TocPageClient />
}
