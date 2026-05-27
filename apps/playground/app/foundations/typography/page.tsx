export default function TypographyPage() {
	return (
		<main>
			<p className="ml-eyebrow">Foundation</p>
			<h1 className="mt-4 text-4xl font-semibold text-primary">Typography</h1>
			<div className="mt-10 grid gap-8">
				<section>
					<p className="ml-eyebrow">Headline</p>
					<p className="font-headline mt-3 text-5xl font-semibold text-primary">
						Interface craft with restraint.
					</p>
				</section>
				<section>
					<p className="ml-eyebrow">Sans</p>
					<p className="mt-3 max-w-3xl text-lg leading-8 text-secondary">
						Monoline uses a readable sans stack for long-form documentation and
						component guidance.
					</p>
				</section>
				<section>
					<p className="ml-eyebrow">Mono</p>
					<p className="mt-3 font-mono text-base text-secondary">
						pnpm add @chitrank2050/monoline-ui
					</p>
				</section>
			</div>
		</main>
	)
}
