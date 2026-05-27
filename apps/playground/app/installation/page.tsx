export default function InstallationPage() {
	return (
		<main className="mx-auto w-full max-w-5xl px-6 py-16">
			<p className="ml-eyebrow">Installation</p>
			<h1 className="mt-5 text-5xl font-semibold tracking-tight text-primary">
				Install monoline/ui
			</h1>
			<p className="mt-5 max-w-3xl text-lg leading-8 text-secondary">
				The playground consumes the local workspace package. External consumers
				will install the npm package and import the theme CSS once.
			</p>
			<pre className="bg-code text-code-text border-border mt-8 overflow-auto rounded-lg border p-5 font-mono text-sm">
				{`pnpm add @chitrank2050/monoline-ui

@import "tailwindcss";
@source "./node_modules/@chitrank2050/monoline-ui/dist/**/*.{js,mjs}";
@import "@chitrank2050/monoline-ui/theme.css";`}
			</pre>
		</main>
	)
}
