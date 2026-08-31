import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import MetaRowPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "MetaRow React Component for Inline Metadata | monoline/ui",
	description:
		"Learn how to use the monoline/ui MetaRow React component to render compact inline metadata groups with monospaced text, separators, and flexible content.",
	path: "/docs/components/meta-row",
})

export default function MetaRowPage() {
	return <MetaRowPageClient />
}
