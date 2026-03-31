import type { TocItem } from "../lib/docs"

export function OnThisPage({ items }: { items: readonly TocItem[] }) {
	return (
		<div>
			<p className="mb-3 text-sm font-medium">On This Page</p>
			<div className="space-y-0.5">
				{items.map((item) => (
					<a
						key={item.id}
						href={`#${item.id}`}
						className="text-muted-foreground hover:text-foreground block py-1 text-sm transition-colors"
					>
						{item.label}
					</a>
				))}
			</div>
		</div>
	)
}
