import type { Metadata } from "next"
import Link from "next/link"

import "./globals.css"

export const metadata: Metadata = {
	title: "monoline/ui",
	description:
		"A Next.js docs and playground site for the Monoline UI component library.",
}

const navItems = [
	{ href: "/", label: "Introduction" },
	{ href: "/installation", label: "Installation" },
	{ href: "/foundations/colors", label: "Foundations" },
	{ href: "/components/footer", label: "Components" },
]

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" data-theme="light">
			<body>
				<div className="min-h-screen">
					<header className="bg-background/85 border-border sticky top-0 z-40 border-b backdrop-blur">
						<div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-6">
							<Link href="/" className="font-mono text-lg font-semibold">
								monoline<span className="text-accent">/</span>ui
							</Link>
							<nav className="hidden items-center gap-1 md:flex">
								{navItems.map((item) => (
									<Link
										key={item.href}
										href={item.href}
										className="text-muted-foreground hover:text-primary rounded-md px-3 py-2 text-sm transition-colors"
									>
										{item.label}
									</Link>
								))}
							</nav>
						</div>
					</header>
					{children}
				</div>
			</body>
		</html>
	)
}
