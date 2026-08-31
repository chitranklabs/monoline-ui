import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import CheckboxPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Accessible React Checkbox Component | monoline/ui Docs",
	description:
		"Build accessible controlled or uncontrolled React checkboxes with checked, unchecked, indeterminate, disabled, keyboard, focus, label, and theme behavior.",
	path: "/components/checkbox",
})

export default function CheckboxPage() {
	return <CheckboxPageClient />
}
