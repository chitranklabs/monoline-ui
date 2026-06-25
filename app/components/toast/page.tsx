import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import ToastPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Toast - monoline/ui component",
	description:
		"Show status feedback banners with tone, message, and optional dismiss action.",
	path: "/components/toast",
})

export default function ToastPage() {
	return <ToastPageClient />
}
