import type { Metadata } from "next"

import NavbarPageClient from "./client-page"

export const metadata: Metadata = {
	title: "Navbar Component - monoline/ui reference",
	description:
		"API reference and preview controls for the responsive monoline/ui Navbar component.",
	openGraph: {
		title: "Navbar Component - monoline/ui reference",
		description:
			"API reference and preview controls for the responsive monoline/ui Navbar component.",
	},
	twitter: {
		title: "Navbar Component - monoline/ui reference",
		description:
			"API reference and preview controls for the responsive monoline/ui Navbar component.",
	},
	alternates: {
		canonical: "/components/navbar",
	},
}

export default function NavbarPage() {
	return <NavbarPageClient />
}
