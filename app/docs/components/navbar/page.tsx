import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import { componentPath } from "../../../lib/routes"
import NavbarPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Navbar React Component for Responsive Headers | monoline/ui",
	description:
		"Learn how to use the monoline/ui Navbar React component to build responsive headers with branding, links, actions, sticky or glass styles, and progress slots.",
	path: componentPath("navbar"),
})

export default function NavbarPage() {
	return <NavbarPageClient />
}
