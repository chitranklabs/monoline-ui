import type { Metadata } from "next"

import "./globals.css"
import { SiteFooter } from "./_components/site-footer"
import { SiteHeader } from "./_components/site-header"

export const metadata: Metadata = {
	title: "monoline/ui",
	description:
		"A Next.js docs and playground site for the Monoline UI component library.",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" data-theme="light">
			<body>
				<div className="min-h-screen bg-background">
					<SiteHeader />
					{children}
					<SiteFooter />
				</div>
			</body>
		</html>
	)
}
