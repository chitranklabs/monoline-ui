const swatches = [
	["Background", "bg-background"],
	["Primary", "bg-primary"],
	["Secondary", "bg-secondary"],
	["Accent", "bg-accent"],
	["Muted", "bg-muted"],
	["Border", "bg-border"],
]

export default function ColorsPage() {
	return (
		<main>
			<p className="ml-eyebrow">Foundation</p>
			<h1 className="mt-4 text-4xl font-semibold text-primary">Colors</h1>
			<p className="mt-4 max-w-3xl text-lg leading-8 text-secondary">
				Color tokens are semantic first. Components consume purpose-based tokens
				instead of raw color values.
			</p>
			<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{swatches.map(([label, className]) => (
					<div
						key={label}
						className="border-border rounded-lg border bg-card p-4"
					>
						<div
							className={`${className} border-border h-28 rounded-md border`}
						/>
						<p className="mt-3 font-mono text-sm text-secondary">{label}</p>
					</div>
				))}
			</div>
		</main>
	)
}
