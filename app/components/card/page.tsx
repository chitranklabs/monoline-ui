import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import CardPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Card - monoline/ui component",
	description:
		"Compose linked, static, or button-backed editorial cards from image, body, footer, tag, and action slots.",
	path: "/components/card",
})

export default function CardPage() {
	return <CardPageClient />
}
