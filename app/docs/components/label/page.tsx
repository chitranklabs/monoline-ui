import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import LabelPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Accessible React Form Label Component | monoline/ui",
	description:
		"Connect visible labels to React form controls with native click-to-focus behavior, disabled-state styling, typed props, and clear accessible naming guidance.",
	path: "/docs/components/label",
})

export default function LabelPage() {
	return <LabelPageClient />
}
