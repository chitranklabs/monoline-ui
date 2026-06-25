import { createPageMetadata } from "../../lib/metadata"
import AvatarPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "Avatar Component  monoline/ui reference",
	description:
		"API reference and preview controls for the monoline/ui Avatar component.",
	path: "/components/avatar",
})

export default function AvatarPage() {
	return <AvatarPageClient />
}
