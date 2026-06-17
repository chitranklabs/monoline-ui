import type { Metadata } from "next"

import ToastPageClient from "./client-page"

export const metadata: Metadata = {
	title: "Toast Component - monoline/ui reference",
	description:
		"API reference and variants for the monoline/ui Toast component, including warning, success, and accent styles.",
	alternates: {
		canonical: "/components/toast",
	},
}

export default function ToastPage() {
	return <ToastPageClient />
}
