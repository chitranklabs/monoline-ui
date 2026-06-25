import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import MediaFramePageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "MediaFrame - monoline/ui component",
	description:
		"Reserve stable media surfaces for images, video, placeholders, captions, and metadata.",
	path: "/components/media-frame",
})

export default function MediaFramePage() {
	return <MediaFramePageClient />
}
