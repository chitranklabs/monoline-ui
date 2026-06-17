import type { Metadata } from "next"

import InputPageClient from "./client-page"

export const metadata: Metadata = {
	title: "Input Component - monoline/ui reference",
	description:
		"API reference and variants for the monoline/ui Input component, including sizes, error state, prefix and suffix decorations.",
	alternates: {
		canonical: "/components/input",
	},
}

export default function InputPage() {
	return <InputPageClient />
}
