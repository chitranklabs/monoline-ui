import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import DialogPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Accessible React Dialog Component | monoline/ui Docs",
	description:
		"Build accessible React modal dialogs with focus trapping, focus restoration, Escape and outside dismissal, labelled content, portals, and Monoline UI styling.",
	path: "/components/dialog",
})

export default function DialogPage() {
	return <DialogPageClient />
}
