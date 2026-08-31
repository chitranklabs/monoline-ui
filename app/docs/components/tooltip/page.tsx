import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import TooltipPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Accessible React Tooltip Component | monoline/ui Docs",
	description:
		"Add concise supporting context to focusable React controls with keyboard and pointer activation, portal positioning, Escape handling, and theme tokens.",
	path: "/docs/components/tooltip",
})

export default function TooltipPage() {
	return <TooltipPageClient />
}
