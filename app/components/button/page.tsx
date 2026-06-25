import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import ButtonPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Button - monoline/ui component",
	description:
		"Render primary actions, secondary actions, icon buttons, loading states, and asChild links.",
	path: "/components/button",
})

export default function ButtonPage() {
	return <ButtonPageClient />
}
