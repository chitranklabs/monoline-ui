import { createPageMetadata } from "../../lib/metadata"
import ActionRailPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "ActionRail Component - monoline/ui reference",
	description:
		"API reference and variants for the monoline/ui ActionRail component, providing layouts for social links or toolbar actions.",
	path: "/components/action-rail",
})

export default function ActionRailPage() {
	return <ActionRailPageClient />
}
