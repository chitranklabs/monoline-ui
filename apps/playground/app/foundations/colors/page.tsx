const swatches = [
	{
		label: "Background",
		token: "--background",
		className: "bg-background",
		usage: "Page canvas",
	},
	{
		label: "Foreground",
		token: "--foreground",
		className: "bg-foreground",
		usage: "Default text",
	},
	{
		label: "Primary",
		token: "--primary",
		className: "bg-primary",
		usage: "Headings and strong UI",
	},
	{
		label: "Body",
		token: "--text-body",
		className: "bg-body",
		usage: "Readable paragraphs",
	},
	{
		label: "Muted",
		token: "--text-muted",
		className: "bg-text-muted",
		usage: "Labels and metadata",
	},
	{
		label: "Accent",
		token: "--accent",
		className: "bg-accent",
		usage: "Actions and status",
	},
	{
		label: "Accent soft",
		token: "--accent-soft",
		className: "bg-accent-soft",
		usage: "Badges and focus glow",
	},
	{
		label: "Surface",
		token: "--surface",
		className: "bg-surface",
		usage: "Raised sections",
	},
	{
		label: "Border",
		token: "--border",
		className: "bg-border",
		usage: "Subtle dividers",
	},
]

export default function ColorsPage() {
	return (
		<main>
			<p className="ml-eyebrow">Foundation</p>
			<h1 className="mt-4 text-4xl font-semibold text-primary">Colors</h1>
			<p className="mt-4 max-w-3xl text-lg leading-8 text-body">
				Color tokens are semantic first. Components consume purpose-based tokens
				instead of raw color values, with explicit text aliases for body, muted,
				and secondary copy.
			</p>
			<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{swatches.map(({ label, token, className, usage }) => (
					<div
						key={token}
						className="border-border rounded-lg border bg-card p-4"
					>
						<div
							className={`${className} border-border h-28 rounded-md border`}
						/>
						<div className="mt-4 flex items-start justify-between gap-4">
							<div>
								<p className="font-mono text-sm text-primary">{label}</p>
								<p className="mt-1 text-sm text-muted-foreground">{usage}</p>
							</div>
							<code className="font-mono text-xs text-accent">{token}</code>
						</div>
					</div>
				))}
			</div>
		</main>
	)
}
