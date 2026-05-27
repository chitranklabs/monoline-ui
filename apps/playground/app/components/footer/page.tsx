import { Footer } from "@chitrank2050/monoline-ui"

export default function FooterPage() {
	return (
		<main>
			<p className="ml-eyebrow">Component</p>
			<h1 className="mt-4 text-4xl font-semibold text-primary">Footer</h1>
			<p className="mt-4 max-w-3xl text-lg leading-8 text-body">
				Footer is the first component in the package. It renders from the
				workspace library and uses foundation tokens for color, typography, and
				spacing.
			</p>
			<div className="border-border mt-10 overflow-auto rounded-lg border bg-card">
				<div className="min-w-[960px]">
					<Footer size="md" />
				</div>
			</div>
		</main>
	)
}
