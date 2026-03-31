"use client"

import { cn } from "@chitrank2050/monoline-ui"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { docsNavigation } from "../lib/docs"

export function DocsSidebar() {
	const pathname = usePathname()

	return (
		<nav className="space-y-8">
			{docsNavigation.map((group) => (
				<div key={group.title}>
					<p className="label-eyebrow mb-3">{group.title}</p>
					<div className="space-y-1">
						{group.items.map((item) => {
							const isActive = pathname === item.href

							return (
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										"docs-nav-link",
										isActive ? "text-foreground font-medium" : "font-normal"
									)}
								>
									{item.label}
								</Link>
							)
						})}
					</div>
				</div>
			))}
		</nav>
	)
}
