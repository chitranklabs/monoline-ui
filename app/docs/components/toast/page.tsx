import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import ToastPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Toast React Component for Status Feedback | monoline/ui",
	description:
		"Learn how to use the monoline/ui Toast React component to deliver status feedback with semantic tones, concise messages, and optional dismiss actions.",
	path: "/docs/components/toast",
})

export default function ToastPage() {
	return <ToastPageClient />
}
