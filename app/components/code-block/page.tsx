import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import CodeBlockPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "CodeBlock React Component with Copy Action | monoline/ui",
	description:
		"Learn how to use the monoline/ui CodeBlock React component to present preformatted code with filenames, language metadata, and a copy-to-clipboard action.",
	path: "/components/code-block",
})

export default function CodeBlockPage() {
	return <CodeBlockPageClient />
}
