const spacing = ["4", "8", "12", "16", "20", "24", "32"]

export default function SpacingMotionPage() {
	return (
		<main>
			<p className="ml-eyebrow">Foundation</p>
			<h1 className="mt-4 text-4xl font-semibold text-primary">
				Spacing & motion
			</h1>
			<p className="mt-4 max-w-3xl text-lg leading-8 text-secondary">
				Spacing tokens are atoms. Components should consume semantic spacing
				utilities from the theme instead of raw one-off values.
			</p>
			<div className="mt-10 grid gap-4">
				{spacing.map((item) => (
					<div key={item} className="flex items-center gap-4">
						<span className="w-16 font-mono text-sm text-muted-foreground">
							{item}px
						</span>
						<div
							className="h-4 rounded-full bg-accent"
							style={{ width: `${item}px` }}
						/>
					</div>
				))}
			</div>
		</main>
	)
}
