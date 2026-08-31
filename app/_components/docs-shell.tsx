import type { ReactNode } from "react"

import { DocsPager } from "./docs-pager"
import { DocsSidebar } from "./docs-sidebar"
import { DocsToc } from "./docs-toc"

export function DocsShell({ children }: { children: ReactNode }) {
	return (
		<div className="docs-shell">
			<DocsSidebar />
			<div className="docs-main">
				{children}
				<DocsPager />
			</div>
			<DocsToc />
		</div>
	)
}
