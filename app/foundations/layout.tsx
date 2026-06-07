import { DocsSidebar } from "../_components/docs-sidebar"

export default function FoundationsLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className="docs-shell">
			<DocsSidebar />
			<div className="docs-main">{children}</div>
		</div>
	)
}
