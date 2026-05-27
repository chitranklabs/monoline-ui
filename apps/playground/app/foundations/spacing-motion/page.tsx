const spacing = [
	["0", "--space-0"],
	["1", "--space-1"],
	["2", "--space-2"],
	["3", "--space-3"],
	["4", "--space-4"],
	["6", "--space-6"],
	["8", "--space-8"],
	["12", "--space-12"],
	["16", "--space-16"],
	["24", "--space-24"],
]

const motion = [
	["Micro", "--duration-micro", "Button hover, focus ring"],
	["Short", "--duration-short", "Card lift, simple reveal"],
	["Medium", "--duration-medium", "Toggle and pop feedback"],
	["Long", "--duration-long", "Section entry"],
]

export default function SpacingMotionPage() {
	return (
		<main>
			<p className="ml-eyebrow">Foundation</p>
			<h1 className="mt-4 text-4xl font-semibold text-primary">
				Spacing & motion
			</h1>
			<p className="mt-4 max-w-3xl text-lg leading-8 text-body">
				Spacing tokens are atoms. Components consume Tailwind utilities backed
				by the foundation scale, and component-specific spacing aliases map back
				to these constants.
			</p>
			<div className="mt-10 grid gap-8 lg:grid-cols-2">
				<section className="border-border rounded-lg border bg-card p-6">
					<p className="ml-eyebrow">Spacing scale</p>
					<div className="mt-6 grid gap-4">
						{spacing.map(([label, token]) => (
							<div key={token} className="grid gap-3 sm:grid-cols-[6rem_1fr]">
								<div>
									<p className="font-mono text-sm text-primary">
										space {label}
									</p>
									<p className="font-mono text-xs text-muted-foreground">
										{token}
									</p>
								</div>
								<div className="flex items-center">
									<div
										className="h-4 rounded-full bg-accent"
										style={{ width: `var(${token})` }}
									/>
								</div>
							</div>
						))}
					</div>
				</section>
				<section className="border-border rounded-lg border bg-card p-6">
					<p className="ml-eyebrow">Motion</p>
					<div className="mt-6 grid gap-4">
						{motion.map(([label, token, usage]) => (
							<div
								key={token}
								className="border-border border-t pt-4 first:border-t-0 first:pt-0"
							>
								<div className="flex items-start justify-between gap-4">
									<div>
										<p className="font-mono text-sm text-primary">{label}</p>
										<p className="mt-1 text-sm text-muted-foreground">
											{usage}
										</p>
									</div>
									<code className="font-mono text-xs text-accent">{token}</code>
								</div>
							</div>
						))}
					</div>
				</section>
			</div>
		</main>
	)
}
