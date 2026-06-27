import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import NavbarPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Navbar - monoline/ui component",
	description:
		"Build responsive headers with brand, nav links, actions, sticky or glass styles, and a progress slot.",
	path: "/components/navbar",
})

export default function NavbarPage() {
	return <NavbarPageClient />
}
