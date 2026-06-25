import { createPageMetadata } from "../../lib/metadata"
import NavbarPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "Navbar Component - monoline/ui reference",
	description:
		"API reference and preview controls for the responsive monoline/ui Navbar component.",
	path: "/components/navbar",
})

export default function NavbarPage() {
	return <NavbarPageClient />
}
