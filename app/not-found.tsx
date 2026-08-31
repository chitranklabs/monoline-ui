import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@chitrank2050/monoline-ui/button"
import { Container } from "@chitrank2050/monoline-ui/container"

export const metadata: Metadata = {
	title: "Page Not Found | Monoline UI React Component Docs",
	description:
		"The requested Monoline UI documentation page does not exist. Browse the React component catalog, design-token foundations, installation guide, or release history.",
	robots: { index: false, follow: true },
}

export default function NotFound() {
	return (
		<Container
			as="main"
			id="main-content"
			tabIndex={-1}
			className="pt-ml-24 pb-ml-24"
		>
			<p className="ml-eyebrow">404 · Documentation</p>
			<h1 className="mt-ml-4 text-4xl font-bold tracking-heading text-text">
				Page not found
			</h1>
			<p className="mt-ml-4 max-w-150 text-base leading-relaxed text-text-secondary">
				That documentation page does not exist. Browse the component catalog or
				return to the Monoline UI introduction.
			</p>
			<div className="mt-ml-6 flex flex-wrap gap-ml-3">
				<Button asChild>
					<Link href="/docs/components">Browse React components</Link>
				</Button>
				<Button asChild variant="secondary">
					<Link href="/">Return to Monoline UI</Link>
				</Button>
			</div>
		</Container>
	)
}
