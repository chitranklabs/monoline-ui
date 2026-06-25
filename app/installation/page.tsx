import type { Metadata } from "next"

import { CodeBlock } from "../_components/code-block"
import { DocsPager } from "../_components/docs-pager"
import { InstallCommand } from "../_components/install-command"
import { createPageMetadata } from "../lib/metadata"

export const metadata: Metadata = createPageMetadata({
	title: "Installation - monoline/ui",
	description:
		"Install monoline/ui, import the Tailwind v4 theme, set the root theme attribute, and use component subpath imports.",
	path: "/installation",
})

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
			"Use React 19 or a current Next.js App Router project with Tailwind CSS v4. TypeScript is optional but recommended.",
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
			"Import the package theme once from your root stylesheet. It defines the CSS variables every component reads.",
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
			'Set data-theme="light" or data-theme="dark" on the root html element.',
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
			"Prefer component subpaths in feature code so bundlers can keep imports narrow.",
		label: "src/app/page.tsx",
		code: `import { Footer } from "@chitrank2050/monoline-ui/footer"

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
		<main id="main-content" tabIndex={-1} className="install-page">
			<header className="install-hero">
				<p className="ml-eyebrow">Get started · ~5 minutes</p>
				<h1>Installation</h1>
				<p>
					Install the package, import the theme once, then use component
					subpaths in your app code.
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
						for props and examples, or jump to{" "}
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
