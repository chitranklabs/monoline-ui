import type { Metadata } from "next"

import { Container } from "@chitrank2050/monoline-ui/container"

import { CodeBlock } from "../_components/code-block"
import { DocsArticleJsonLd } from "../_components/docs-article-json-ld"
import { DocsPager } from "../_components/docs-pager"
import { InstallCommand } from "../_components/install-command"
import { createPageMetadata } from "../lib/metadata"

const displayTitle = "Installation"
const seoTitle = "Install monoline/ui for React and Tailwind CSS v4 | Docs"
const pageDescription =
	"Install monoline/ui in a React project, import its Tailwind CSS v4 theme, configure the root theme attribute, and use efficient component subpath imports."

export const metadata: Metadata = createPageMetadata({
	title: seoTitle,
	description: pageDescription,
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
			"Import the package theme once from your root stylesheet. It defines the CSS variables and registers Monoline's compiled sources with Tailwind.",
		label: "src/app/globals.css",
		code: `@import "tailwindcss";
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
		<Container
			as="main"
			id="main-content"
			tabIndex={-1}
			className="install-page pt-ml-14 pb-ml-20"
		>
			<DocsArticleJsonLd
				title={displayTitle}
				description={pageDescription}
				path="/installation"
				section="Installation"
				sectionPath="/installation"
			/>
			<header className="docs-page__head">
				<p className="ml-eyebrow">Get started · ~5 minutes</p>
				<h1>{displayTitle}</h1>
				<p>
					Add the package, import its theme once, and keep application imports
					focused on the components you use.
				</p>
			</header>

			<div className="flex flex-col gap-ml-8">
				{installSteps.map((step) => (
					<section
						key={step.number}
						className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-ml-5"
					>
						<span className="pt-ml-1 font-mono text-2xs text-(--text-muted)">
							{step.number}
						</span>
						<div className="min-w-0">
							<h2 className="text-lg font-semibold tracking-body text-(--text)">
								{step.title}
							</h2>
							<p className="mt-ml-2-5 max-w-170 text-base leading-normal text-(--text-secondary)">
								{step.description}
							</p>

							{step.number === "02" ? <InstallCommand /> : null}

							{step.label && step.code ? (
								<div className="mt-ml-4">
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

			<div
				className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-ml-4 mt-ml-12 border border-(--accent) rounded-xl p-ml-5"
				style={{
					background:
						"color-mix(in oklch, var(--accent-soft) 45%, var(--surface))",
				}}
			>
				<div className="inline-flex items-center justify-center size-ml-7 rounded-full bg-(--accent) text-(--accent-foreground) text-sm">
					✓
				</div>
				<div>
					<h3 className="text-(--text) text-base font-semibold">
						You&apos;re ready.
					</h3>
					<p className="mt-ml-1 text-(--text-secondary) text-sm">
						Browse the{" "}
						<a href="/components/footer" className="text-(--accent)">
							component reference
						</a>{" "}
						for props and examples, or jump to{" "}
						<a href="/foundations/colors" className="text-(--accent)">
							Foundations
						</a>{" "}
						to see the token system.
					</p>
				</div>
			</div>

			<DocsPager />
		</Container>
	)
}
