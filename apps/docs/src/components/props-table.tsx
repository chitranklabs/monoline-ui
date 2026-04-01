type Prop = {
	name: string
	type: string
	default?: string
	description: string
}

export function PropsTable({ props }: { props: readonly Prop[] }) {
	return (
		<div className="overflow-x-auto rounded-lg border border-border">
			<table className="w-full text-sm">
				<thead>
					<tr className="border-b border-border bg-muted/40">
						<th className="px-4 py-2.5 text-left font-medium text-foreground">
							Prop
						</th>
						<th className="px-4 py-2.5 text-left font-medium text-foreground">
							Type
						</th>
						<th className="px-4 py-2.5 text-left font-medium text-foreground">
							Default
						</th>
						<th className="px-4 py-2.5 text-left font-medium text-foreground">
							Description
						</th>
					</tr>
				</thead>
				<tbody>
					{props.map((prop) => (
						<tr
							key={prop.name}
							className="border-b border-border/50 last:border-0"
						>
							<td className="px-4 py-2.5">
								<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
									{prop.name}
								</code>
							</td>
							<td className="px-4 py-2.5">
								<code className="font-mono text-xs text-muted-foreground">
									{prop.type}
								</code>
							</td>
							<td className="px-4 py-2.5 text-muted-foreground">
								{prop.default ? (
									<code className="font-mono text-xs">{prop.default}</code>
								) : (
									<span className="text-xs">—</span>
								)}
							</td>
							<td className="px-4 py-2.5 text-muted-foreground">
								{prop.description}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
