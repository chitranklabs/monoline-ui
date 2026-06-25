import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import InputPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Input - monoline/ui component",
	description:
		"Render text fields with prefix and suffix slots, validation state, and consistent control sizing.",
	path: "/components/input",
})

export default function InputPage() {
	return <InputPageClient />
}
