import { createPageMetadata } from "../../lib/metadata"
import MediaFramePageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "MediaFrame Component  monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui MediaFrame component.",
	path: "/components/media-frame",
})

export default function MediaFramePage() {
	return <MediaFramePageClient />
}
