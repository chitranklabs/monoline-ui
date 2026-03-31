import { Button, Navbar, SectionHeader } from "@chitrank2050/monoline-ui"

import type { TocItem } from "../lib/docs"
import { DocsSidebar } from "./docs-sidebar"
import { OnThisPage } from "./on-this-page"
import { PaletteSwitcher } from "./palette-switcher"
import { ThemeToggle } from "./theme-toggle"

export function DocsShell({
	eyebrow,
	title,
	description,
	toc,
	children,
}: {
	eyebrow: string
	title: string
	description: string
	toc: readonly TocItem[]
	children: React.ReactNode
}) {
	return (
		<div className="min-h-screen">
			<Navbar
				brand="Monoline UI"
				links={[
					{ href: "/introduction", label: "Docs" },
					{ href: "/components/button", label: "Components" },
					{ href: "/foundations/typography", label: "Foundations" },
				]}
				actions={
					<>
						<div className="hidden xl:flex">
							<ThemeToggle />
						</div>
						<div className="hidden xl:flex">
							<PaletteSwitcher />
						</div>
						<Button
							asChild
							variant="outline"
							className="hidden rounded-full lg:flex"
						>
							<a href="/installation">Install</a>
						</Button>
					</>
				}
			/>

			<div className="shell py-8 lg:py-10">
				<div className="grid gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
					<aside className="hidden xl:sticky xl:top-20 xl:block xl:max-h-[calc(100vh-5rem)] xl:self-start">
						<div className="relative flex max-h-[calc(100vh-5rem)] flex-col overflow-hidden">
							<div className="sidebar-scroll flex-1 overflow-y-auto pr-2">
								<DocsSidebar />
							</div>
							<div className="sidebar-fade pointer-events-none absolute inset-x-0 bottom-0 h-10" />
						</div>
					</aside>

					<main className="min-w-0">
						<div className="mb-8">
							<SectionHeader
								eyebrow={eyebrow}
								title={title}
								description={description}
							/>
						</div>
						<div className="border-t border-border pt-8">{children}</div>
					</main>

					<aside className="hidden xl:sticky xl:top-20 xl:block xl:self-start">
						<OnThisPage items={toc} />
					</aside>
				</div>
			</div>
		</div>
	)
}
