import { DocsShell } from "../_components/docs-shell"

export default function ComponentsLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return <DocsShell>{children}</DocsShell>
}
