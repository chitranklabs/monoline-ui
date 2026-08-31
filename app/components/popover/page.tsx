import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import PopoverPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "React Popover Component for Contextual UI | monoline/ui",
	description:
		"Build accessible React popovers with anchored positioning, collision handling, keyboard dismissal, focus restoration, arrows, portals, and Monoline styling.",
	path: "/components/popover",
})

export default function PopoverPage() {
	return <PopoverPageClient />
}
