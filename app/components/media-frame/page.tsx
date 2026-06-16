import type { Metadata } from "next"

import MediaFramePageClient from "./client-page"

export const metadata: Metadata = {
	title: "MediaFrame Component  monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui MediaFrame component.",
	openGraph: {
		title: "MediaFrame Component  monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui MediaFrame component.",
	},
	twitter: {
		title: "MediaFrame Component  monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui MediaFrame component.",
	},
	alternates: {
		canonical: "/components/media-frame",
	},
}

export default function MediaFramePage() {
	return <MediaFramePageClient />
}
