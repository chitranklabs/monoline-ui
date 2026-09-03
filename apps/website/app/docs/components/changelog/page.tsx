import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import { componentPath } from "../../../lib/routes"
import ChangelogPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "React Changelog Timeline Component | monoline/ui Docs",
	description:
		"Render accessible React release timelines from git-cliff JSON with grouped commits, GitHub links, version anchors, runtime guidance, and typed Monoline UI APIs.",
	path: componentPath("changelog"),
})

export default function ChangelogPage() {
	return <ChangelogPageClient />
}
