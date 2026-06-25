import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import CodeBlockPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "CodeBlock - monoline/ui component",
	description:
		"Show preformatted code with an optional filename, language metadata, and copy action.",
	path: "/components/code-block",
})

export default function CodeBlockPage() {
	return <CodeBlockPageClient />
}
