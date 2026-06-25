import { createPageMetadata } from "../../lib/metadata"
import BadgePageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "Badge Component - monoline/ui reference",
	description:
		"API reference and variants for the monoline/ui Badge component, including solid, outline, muted, and accent variations.",
	path: "/components/badge",
})

export default function BadgePage() {
	return <BadgePageClient />
}
