import type { Metadata } from "next"

import ButtonPageClient from "./client-page"

export const metadata: Metadata = {
	title: "Button Component - monoline/ui reference",
	description:
		"API reference and variants for the monoline/ui Button component, including sizes, icon buttons, pill buttons, and asChild composition.",
	alternates: {
		canonical: "/components/button",
	},
}

export default function ButtonPage() {
	return <ButtonPageClient />
}
