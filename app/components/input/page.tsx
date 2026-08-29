import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import InputPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Input React Form Component with Validation | monoline/ui",
	description:
		"Learn how to use the monoline/ui Input React component for accessible text fields with prefix and suffix slots, validation states, and consistent sizing.",
	path: "/components/input",
})

export default function InputPage() {
	return <InputPageClient />
}
