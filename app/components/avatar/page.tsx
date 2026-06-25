import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import AvatarPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Avatar - monoline/ui component",
	description:
		"Render identity images or initials with fixed size tokens, fallback color, and slotted image support.",
	path: "/components/avatar",
})

export default function AvatarPage() {
	return <AvatarPageClient />
}
