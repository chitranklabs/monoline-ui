import { createPageMetadata } from "../../lib/metadata"
import TogglePageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "Toggle Component - monoline/ui reference",
	description:
		"API reference for the monoline/ui Toggle component, a controlled or uncontrolled switch with token-backed motion.",
	path: "/components/toggle",
})

export default function TogglePage() {
	return <TogglePageClient />
}
