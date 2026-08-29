import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import ActionRailPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "ActionRail React Toolbar Component | monoline/ui Docs",
	description:
		"Learn how to use the monoline/ui ActionRail React component to group compact actions in toolbars, side rails, and social links with accessible layout options.",
	path: "/components/action-rail",
})

export default function ActionRailPage() {
	return <ActionRailPageClient />
}
