import type { Metadata } from "next"

import AvatarPageClient from "./client-page"

export const metadata: Metadata = {
	title: "Avatar Component  monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui Avatar component.",
	openGraph: {
		title: "Avatar Component  monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui Avatar component.",
	},
	twitter: {
		title: "Avatar Component  monoline/ui reference",
		description:
			"API reference and preview controls for the monoline/ui Avatar component.",
	},
	alternates: {
		canonical: "/components/avatar",
	},
}

export default function AvatarPage() {
	return <AvatarPageClient />
}
