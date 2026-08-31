import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import { componentPath } from "../../../lib/routes"
import RadioGroupPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Accessible React Radio Group Component | monoline/ui",
	description:
		"Present accessible one-of-many choices with a React RadioGroup that supports arrow-key navigation, controlled state, disabled options, labels, and descriptions.",
	path: componentPath("radio-group"),
})

export default function RadioGroupPage() {
	return <RadioGroupPageClient />
}
