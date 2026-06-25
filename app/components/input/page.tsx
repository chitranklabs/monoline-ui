import { createPageMetadata } from "../../lib/metadata"
import InputPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "Input Component - monoline/ui reference",
	description:
		"API reference and variants for the monoline/ui Input component, including sizes, error state, prefix and suffix decorations.",
	path: "/components/input",
})

export default function InputPage() {
	return <InputPageClient />
}
