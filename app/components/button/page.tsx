import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import ButtonPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Button React Component with Loading States | monoline/ui",
	description:
		"Learn how to use the monoline/ui Button React component for primary, secondary, and icon actions with loading states, behavior, and polymorphic links.",
	path: "/components/button",
})

export default function ButtonPage() {
	return <ButtonPageClient />
}
