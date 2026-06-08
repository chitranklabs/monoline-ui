import type { Metadata } from "next"
import { CodeBlock } from "../_components/code-block"
import { DocsPager } from "../_components/docs-pager"
import { InstallCommand } from "../_components/install-command"

export const metadata: Metadata = {
	title: "Installation — monoline/ui component library",
	description:
		"Get started with monoline/ui. Set up the Tailwind v4 design tokens, package theme import, and root theme provider in 5 minutes.",
	openGraph: {
		title: "Installation — monoline/ui component library",
		description:
			"Get started with monoline/ui. Set up the Tailwind v4 design tokens, package theme import, and root theme provider in 5 minutes.",
	},
	twitter: {
		title: "Installation — monoline/ui component library",
		description:
			"Get started with monoline/ui. Set up the Tailwind v4 design tokens, package theme import, and root theme provider in 5 minutes.",
	},
	alternates: {
		canonical: "/installation",
	},
}

interface InstallStep {
	number: string
	title: string
	description: string
	label?: string
	code?: string
	language?: string
}

const installSteps: InstallStep[] = [
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
	},
	{
		number: "03",
		title: "Add the design tokens",
		description:
			"Import the package theme once from globals.css. This defines every CSS variable the components consume.",
		label: "src/app/globals.css",
		code: `@import "tailwindcss";
@source "./node_modules/@chitrank2050/monoline-ui/dist/**/*.{js,mjs}";
@import "@chitrank2050/monoline-ui/theme.css";

/* The package theme now owns colours, typography, spacing, and component tokens. */`,
		language: "css",
	},
	{
		number: "04",
		title: "Set the theme on <html>",
		description:
			'data-theme controls light vs dark. Use "light" or "dark" on the root html element.',
		label: "src/app/layout.tsx",
		code: `export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body>{children}</body>
    </html>
  )
}`,
		language: "tsx",
	},
	{
		number: "05",
		title: "Import a component",
		description:
			"Use component subpaths for feature code. The root package remains available as a convenience barrel.",
		label: "src/app/page.tsx",
		code: `import { Footer } from "@chitrank2050/monoline-ui/components/footer"

export default function Page() {
  return (
    <Footer
      size="md"
      columns={[
        { title: "Navigate", links: [{ label: "Projects", href: "/projects" }] },
        { title: "Elsewhere", links: [{ label: "GitHub", href: "https://github.com", external: true }] },
      ]}
    />
  )
}`,
		language: "tsx",
	},
] as const

export default function InstallationPage() {
	return (
		<main className="install-page">
			<header className="install-hero">
				<p className="ml-eyebrow">Get started · ~5 minutes</p>
				<h1>Installation</h1>
				<p>
					monoline/ui is distributed as a single npm package. Install, paste the
					theme import, you&apos;re done.
				</p>
			</header>

			<div className="install-steps">
				{installSteps.map((step) => (
					<section key={step.number} className="install-step">
						<div className="install-step__number">{step.number}</div>
						<div className="install-step__body">
							<h2>{step.title}</h2>
							<p>{step.description}</p>

							{step.number === "02" ? <InstallCommand /> : null}

							{step.label && step.code ? (
								<div className="install-code">
									<CodeBlock
										code={step.code}
										fileName={step.label}
										language={step.language}
									/>
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
						Browse the{" "}
						<a href="/components/footer" className="ml-interaction-color">
							component reference
						</a>{" "}
						for the full API, or jump to{" "}
						<a href="/foundations/colors" className="ml-interaction-color">
							Foundations
						</a>{" "}
						to see the token system.
					</p>
				</div>
			</div>
			<DocsPager />
		</main>
	)
}
