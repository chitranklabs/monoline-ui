import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import { componentPath } from "../../../lib/routes"
import CommandSearchPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "CommandSearch React Command Palette | monoline/ui Docs",
	description:
		"Learn how to use the monoline/ui CommandSearch React component to build a modal command palette with results, filtering, shortcuts, and keyboard navigation.",
	path: componentPath("command-search"),
})

export default function CommandSearchPage() {
	return <CommandSearchPageClient />
}
