import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import { componentPath } from "../../../lib/routes"
import MediaFramePageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "MediaFrame React Component for Stable Media | monoline/ui",
	description:
		"Learn how to use the monoline/ui MediaFrame React component to reserve stable, responsive surfaces for images, video, placeholders, captions, and metadata.",
	path: componentPath("media-frame"),
})

export default function MediaFramePage() {
	return <MediaFramePageClient />
}
