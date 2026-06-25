import { createPageMetadata } from "../../lib/metadata"
import FooterPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "Footer Component  monoline/ui reference",
	description:
		"API reference and layout configurations for the responsive monoline/ui Footer component, including newsletter forms.",
	path: "/components/footer",
})

export default function FooterPage() {
	return <FooterPageClient />
}
