import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import ChangelogPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "ChangelogTimeline React Component | monoline/ui",
	description:
		"Learn how to render conventional-commit changelogs via git-cliff JSON data using the monoline/ui ChangelogTimeline component.",
	path: "/components/changelog",
})

export default function ChangelogPage() {
	return <ChangelogPageClient />
}
