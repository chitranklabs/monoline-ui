import Link from "next/link"

const principles = [
	"Own foundations before components",
	"Eat the library inside the playground",
	"Promote shared UI only after repeated use",
]

export default function HomePage() {
	return (
		<main className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
			<section>
				<p className="ml-eyebrow">Next.js playground</p>
				<h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight text-primary md:text-7xl">
					monoline/ui component library
				</h1>
				<p className="mt-6 max-w-3xl text-xl leading-8 text-body">
					A docs and preview surface for the React design library built for the
					portfolio. The playground imports the package directly so every page
					uses the same tokens and components consumers will install.
				</p>
				<div className="mt-8 flex flex-wrap gap-3">
					<Link
						href="/installation"
						className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
					>
						Install
					</Link>
					<Link
						href="/components/footer"
						className="border-border rounded-full border px-5 py-3 text-sm font-medium text-primary"
					>
						View Footer
					</Link>
				</div>
			</section>
			<section className="border-border bg-card/70 rounded-lg border p-6 shadow-[var(--shadow-card)]">
				<p className="ml-eyebrow">Principles</p>
				<div className="mt-6 grid gap-4">
					{principles.map((principle, index) => (
						<div
							key={principle}
							className="border-border flex items-center gap-4 border-t pt-4 first:border-t-0 first:pt-0"
						>
							<span className="font-mono text-sm text-accent">
								0{index + 1}
							</span>
							<p className="text-lg text-body">{principle}</p>
						</div>
					))}
				</div>
			</section>
		</main>
	)
}
