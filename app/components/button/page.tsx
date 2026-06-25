import { createPageMetadata } from "../../lib/metadata"
import ButtonPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "Button Component - monoline/ui reference",
	description:
		"API reference and variants for the monoline/ui Button component, including sizes, icon buttons, pill buttons, and asChild composition.",
	path: "/components/button",
})

export default function ButtonPage() {
	return <ButtonPageClient />
}
