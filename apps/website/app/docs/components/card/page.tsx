import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import { componentPath } from "../../../lib/routes"
import CardPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Card React Component for Editorial Content | monoline/ui",
	description:
		"Learn how to use the monoline/ui Card React component to compose linked, static, or button-backed editorial content from flexible image, body, and action slots.",
	path: componentPath("card"),
})

export default function CardPage() {
	return <CardPageClient />
}
