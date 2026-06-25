import { createPageMetadata } from "../../lib/metadata"
import CodeBlockPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "CodeBlock Component - monoline/ui reference",
	description:
		"API reference and variants for the monoline/ui CodeBlock component, featuring custom labels and clipboard copy utilities.",
	path: "/components/code-block",
})

export default function CodeBlockPage() {
	return <CodeBlockPageClient />
}
