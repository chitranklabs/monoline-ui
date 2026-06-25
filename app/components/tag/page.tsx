import { createPageMetadata } from "../../lib/metadata"
import TagPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "Tag Component - monoline/ui reference",
	description:
		"API reference for the monoline/ui Tag component, covering filter pills and quieter tech chips.",
	path: "/components/tag",
})

export default function TagPage() {
	return <TagPageClient />
}
