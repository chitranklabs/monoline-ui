import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import ActionRailPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "ActionRail - monoline/ui component",
	description:
		"Group compact actions vertically or horizontally for toolbars, side rails, and social links.",
	path: "/components/action-rail",
})

export default function ActionRailPage() {
	return <ActionRailPageClient />
}
