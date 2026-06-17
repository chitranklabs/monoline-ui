import type { Metadata } from "next"

import CodeBlockPageClient from "./client-page"

export const metadata: Metadata = {
	title: "CodeBlock Component - monoline/ui reference",
	description:
		"API reference and variants for the monoline/ui CodeBlock component, featuring custom labels and clipboard copy utilities.",
	alternates: {
		canonical: "/components/code-block",
	},
}

export default function CodeBlockPage() {
	return <CodeBlockPageClient />
}
