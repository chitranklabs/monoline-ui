import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import AvatarPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Avatar React Component for User Identity | monoline/ui",
	description:
		"Learn how to use the monoline/ui Avatar React component for user images and initials with fixed size tokens, fallback colors, and slotted image support.",
	path: "/components/avatar",
})

export default function AvatarPage() {
	return <AvatarPageClient />
}
