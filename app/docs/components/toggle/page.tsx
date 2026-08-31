import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import { componentPath } from "../../../lib/routes"
import TogglePageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Toggle React Switch Component with A11y | monoline/ui Docs",
	description:
		"Learn how to use the monoline/ui Toggle React component for controlled or uncontrolled switches with semantics, state labels, and token-backed motion.",
	path: componentPath("toggle"),
})

export default function TogglePage() {
	return <TogglePageClient />
}
