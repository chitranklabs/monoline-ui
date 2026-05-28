const installSteps = [
	{
		number: "01",
		title: "Prerequisites",
		description:
			"Next.js 14+ (App Router) or React 18+, Tailwind v4, TypeScript optional but recommended. monoline/ui has zero runtime dependencies beyond React and Tailwind.",
	},
	{
		number: "02",
		title: "Install the package",
		description: "Pick your package manager:",
		tabs: ["npm", "pnpm", "yarn", "bun"],
		code: "$ pnpm add monoline-ui",
	},
	{
		number: "03",
		title: "Add the design tokens",
		description:
			"Drop the tokens file into your app and import it from globals.css. This defines every CSS variable the components consume.",
		label: "src/app/globals.css",
		code: `@import "tailwindcss";
@import "monoline-ui/tokens.css";

/* That's it. Every variable is now available:
   --primary, --secondary, --surface, --accent, etc. */`,
	},
	{
		number: "04",
		title: "Set the theme on <html>",
		description:
			'data-theme controls light vs dark. Either hard-code one, or wire up the included <ThemeProvider>.',
		label: "src/app/layout.tsx",
		code: `export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body>{children}</body>
    </html>
  )
}`,
	},
	{
		number: "05",
		title: "Import a component",
		description:
			"Tree-shake by default. Each component is its own entry point.",
		label: "src/app/page.tsx",
		code: `import { Button } from "monoline-ui/Button"
import { Card, CardBody } from "monoline-ui/Card"

export default function Page() {
  return (
    <Card variant="hover">
      <CardBody>
        <Button variant="primary">Contact me</Button>
      </CardBody>
    </Card>
  )
}`,
	},
] as const

export default function InstallationPage() {
	return (
		<main className="install-page">
			<header className="install-hero">
				<p className="ml-eyebrow">Get started · ~5 minutes</p>
				<h1>Installation</h1>
				<p>
					monoline/ui is distributed as a single npm package. Install, paste
					the tokens file, you&apos;re done.
				</p>
			</header>

			<div className="install-steps">
				{installSteps.map((step) => (
					<section key={step.number} className="install-step">
						<div className="install-step__number">{step.number}</div>
						<div className="install-step__body">
							<h2>{step.title}</h2>
							<p>{step.description}</p>

							{step.tabs ? (
								<div className="install-command">
									<div className="install-command__tabs">
										{step.tabs.map((tab) => (
											<button
												key={tab}
												type="button"
												aria-pressed={tab === "pnpm"}
											>
												{tab}
											</button>
										))}
									</div>
									<div className="install-command__body">
										<code>{step.code}</code>
										<button type="button">Copy</button>
									</div>
								</div>
							) : null}

							{step.label ? (
								<div className="install-code">
									<div className="install-code__meta">
										<span>{step.label}</span>
										<button type="button">Copy</button>
									</div>
									<pre>{step.code}</pre>
								</div>
							) : null}
						</div>
					</section>
				))}
			</div>

			<div className="install-ready">
				<div className="install-ready__icon">✓</div>
				<div>
					<h3>You&apos;re ready.</h3>
					<p>
						Browse the <a href="/components/footer">component reference</a> for
						the full API, or jump to <a href="/foundations/colors">Foundations</a>{" "}
						to see the token system.
					</p>
				</div>
			</div>
		</main>
	)
}
