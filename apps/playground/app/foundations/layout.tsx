import Link from "next/link"

const items = [
	{ href: "/foundations/colors", label: "Colors" },
	{ href: "/foundations/typography", label: "Typography" },
	{ href: "/foundations/spacing-motion", label: "Spacing & motion" },
]

export default function FoundationsLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[14rem_1fr]">
			<aside className="lg:sticky lg:top-24 lg:self-start">
				<p className="ml-eyebrow">Foundations</p>
				<nav className="mt-4 grid gap-1">
					{items.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="text-muted-foreground hover:text-primary rounded-md px-3 py-2 text-sm transition-colors"
						>
							{item.label}
						</Link>
					))}
				</nav>
			</aside>
			{children}
		</div>
	)
}
