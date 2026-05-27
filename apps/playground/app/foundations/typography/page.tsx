const typeScale = [
	["Display", "--text-7xl", "text-7xl"],
	["Heading", "--text-5xl", "text-5xl"],
	["Section", "--text-3xl", "text-3xl"],
	["Body", "--text-lg", "text-lg"],
	["Meta", "--text-2xs", "text-[var(--text-2xs)]"],
]

export default function TypographyPage() {
	return (
		<main>
			<p className="ml-eyebrow">Foundation</p>
			<h1 className="mt-4 text-4xl font-semibold text-primary">Typography</h1>
			<p className="mt-4 max-w-3xl text-lg leading-8 text-body">
				The library exposes sans, mono, script, and headline families as token
				backed Tailwind utilities. Component text should use these families and
				scale tokens instead of local font declarations.
			</p>
			<div className="mt-10 grid gap-8">
				<section className="border-border rounded-lg border bg-card p-6">
					<p className="ml-eyebrow">Families</p>
					<div className="mt-6 grid gap-6">
						<p className="font-script text-6xl leading-none text-primary">
							Chitrank
						</p>
						<p className="font-headline text-5xl font-semibold tracking-heading text-primary">
							Interface craft with restraint.
						</p>
						<p className="max-w-3xl text-lg leading-8 text-body">
							Monoline uses a readable sans stack for documentation, component
							guidance, and product-like surfaces.
						</p>
						<p className="font-mono text-base text-muted-foreground">
							pnpm add @chitrank2050/monoline-ui
						</p>
					</div>
				</section>
				<section className="border-border rounded-lg border bg-card p-6">
					<p className="ml-eyebrow">Scale</p>
					<div className="mt-6 grid gap-5">
						{typeScale.map(([label, token, className]) => (
							<div
								key={token}
								className="border-border grid gap-3 border-t pt-5 first:border-t-0 first:pt-0 md:grid-cols-[10rem_minmax(0,1fr)] md:items-baseline"
							>
								<div>
									<p className="font-mono text-sm text-primary">{label}</p>
									<p className="mt-1 font-mono text-xs text-muted-foreground">
										{token}
									</p>
								</div>
								<p className={`${className} leading-tight text-primary`}>
									The quick brown fox jumps.
								</p>
							</div>
						))}
					</div>
				</section>
			</div>
		</main>
	)
}
