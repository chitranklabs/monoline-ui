import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import { componentPath } from "../../../lib/routes"
import TextareaPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "React Textarea Component for Accessible Forms | monoline/ui",
	description:
		"Collect accessible multiline input with the Monoline React Textarea, including sizes, validation states, controlled resizing, typed props, and theme tokens.",
	path: componentPath("textarea"),
})

export default function TextareaPage() {
	return <TextareaPageClient />
}
