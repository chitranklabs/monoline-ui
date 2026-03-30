import {
	Badge,
	BentoPanel,
	Button,
	Card,
	Footer,
	Input,
	Navbar,
	SectionHeader,
	StatCard,
	StatusBadge,
} from "@chitrank2050/monoline-ui"
import { Blocks, Layers3, Sparkles } from "lucide-react"
import { notFound } from "next/navigation"

import { CommandTabs } from "../../../components/command-tabs"
import { ComponentPreview } from "../../../components/component-preview"
import { DocsShell } from "../../../components/docs-shell"

const toc = [
	{ id: "installation", label: "Installation" },
	{ id: "usage", label: "Usage" },
	{ id: "examples", label: "Examples" },
	{ id: "preview", label: "Preview" },
] as const

const componentPages = {
	badge: {
		title: "Badge",
		importName: "Badge",
		description: "Compact labels for metadata, categories, and small states.",
		usage: `<Badge variant="outline">Documentation</Badge>`,
	},
	button: {
		title: "Button",
		importName: "Button",
		description: "Action surfaces with a clear primary-to-ghost hierarchy.",
		usage: `<Button variant="secondary">Save changes</Button>`,
	},
	card: {
		title: "Card",
		importName: "Card",
		description:
			"A generic content surface that changes through variants instead of domain-specific names.",
		usage: `<Card variant="tertiary">
  <Card.Header>
    <Card.Eyebrow>Featured</Card.Eyebrow>
    <Card.Title>Launch recap</Card.Title>
    <Card.Description>One surface, different levels of emphasis.</Card.Description>
  </Card.Header>
</Card>`,
	},
	input: {
		title: "Input",
		importName: "Input",
		description:
			"Form fields tuned to the same spacing, radius, and focus rhythm.",
		usage: `<Input placeholder="name@company.com" />`,
	},
	navbar: {
		title: "Navbar",
		importName: "Navbar",
		description:
			"A top-level header shell for docs, products, and portfolio pages.",
		usage: `<Navbar
  brand="Monoline UI"
  links={[
    { href: "/introduction", label: "Docs" },
    { href: "/components/card", label: "Components" },
  ]}
/>`,
	},
	footer: {
		title: "Footer",
		importName: "Footer",
		description: "A flexible footer with credit and utility links.",
		usage: `<Footer
  links={[
    { href: "https://github.com", label: "GitHub" },
    { href: "https://x.com", label: "X" },
  ]}
/>`,
	},
	"status-badge": {
		title: "Status Badge",
		importName: "StatusBadge",
		description:
			"A generic status chip for availability, state, and lightweight system feedback.",
		usage: `<StatusBadge label="Sync active" status="success" />`,
	},
	"section-header": {
		title: "Section Header",
		importName: "SectionHeader",
		description:
			"A page and section heading shell for consistent editorial rhythm.",
		usage: `<SectionHeader
  eyebrow="Overview"
  title="Documentation built around the system"
  description="Lead with structure, then slot actions in when needed."
/>`,
	},
	"stat-card": {
		title: "Stat Card",
		importName: "StatCard",
		description:
			"A compact metric surface for product, trust, and benchmark content.",
		usage: `<StatCard label="Coverage" value="84%" helper="Across design tokens and primitives." />`,
	},
	"bento-panel": {
		title: "Bento Panel",
		importName: "BentoPanel",
		description:
			"An editorial panel for grids that need stronger hierarchy than a plain card.",
		usage: `<BentoPanel
  eyebrow="System"
  title="Built for modular composition"
  description="Use it when a surface needs more storytelling weight."
/>`,
	},
} as const

export function generateStaticParams() {
	return Object.keys(componentPages).map((slug) => ({ slug }))
}

function renderApi(slug: keyof typeof componentPages) {
	if (slug === "badge") {
		return (
			<div className="flex flex-wrap gap-3">
				<Badge>Default</Badge>
				<Badge variant="secondary">Secondary</Badge>
				<Badge variant="outline">Outline</Badge>
			</div>
		)
	}

	if (slug === "button") {
		return (
			<div className="flex flex-wrap gap-3">
				<Button>Primary</Button>
				<Button variant="secondary">Secondary</Button>
				<Button variant="outline">Outline</Button>
				<Button variant="ghost">Ghost</Button>
			</div>
		)
	}

	if (slug === "card") {
		return (
			<div className="grid gap-4 lg:grid-cols-2">
				{[
					{
						variant: "primary" as const,
						label: "Primary",
						copy: "Balanced surface for most content blocks.",
					},
					{
						variant: "secondary" as const,
						label: "Secondary",
						copy: "Quieter emphasis for supporting content.",
					},
					{
						variant: "tertiary" as const,
						label: "Tertiary",
						copy: "Elevated emphasis for featured sections.",
					},
					{
						variant: "ghost" as const,
						label: "Ghost",
						copy: "Low-chrome grouping inside denser layouts.",
					},
				].map((item) => (
					<Card key={item.label} variant={item.variant}>
						<Card.Header>
							<Card.Eyebrow>{item.label}</Card.Eyebrow>
							<Card.Title>{item.label} Card</Card.Title>
							<Card.Description>{item.copy}</Card.Description>
						</Card.Header>
						<Card.Footer>
							<Button size="sm" variant="ghost">
								Inspect
							</Button>
						</Card.Footer>
					</Card>
				))}
			</div>
		)
	}

	if (slug === "input") {
		return (
			<div className="max-w-md space-y-3">
				<Input placeholder="name@company.com" />
				<Input type="password" placeholder="Password" />
				<Button className="w-full">Request access</Button>
			</div>
		)
	}

	if (slug === "navbar") {
		return (
			<Navbar
				brand="Monoline UI"
				links={[
					{ href: "#", label: "Docs" },
					{ href: "#", label: "Components" },
					{ href: "#", label: "Foundations" },
				]}
				actions={
					<>
						<Button variant="ghost" size="sm">
							GitHub
						</Button>
						<Button variant="outline" size="sm">
							Install
						</Button>
					</>
				}
			/>
		)
	}

	if (slug === "footer") {
		return (
			<Footer
				credit={
					<>
						© 2026 <strong className="font-medium">Monoline UI</strong>
					</>
				}
				links={[
					{ href: "#", label: "Docs" },
					{ href: "#", label: "GitHub" },
					{ href: "#", label: "License" },
				]}
			/>
		)
	}

	if (slug === "status-badge") {
		return (
			<div className="flex flex-wrap gap-3">
				<StatusBadge label="Available now" status="success" />
				<StatusBadge label="Review queued" status="warning" />
				<StatusBadge label="Background sync idle" status="neutral" />
			</div>
		)
	}

	if (slug === "section-header") {
		return (
			<SectionHeader
				eyebrow="Overview"
				title="Consistent page framing across docs and landing sections"
				description="The component owns alignment, rhythm, and optional actions so each page doesn’t reinvent its own header treatment."
				actions={
					<>
						<Button size="sm">Get started</Button>
						<Button size="sm" variant="outline">
							View source
						</Button>
					</>
				}
			/>
		)
	}

	if (slug === "stat-card") {
		return (
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				<StatCard
					label="Coverage"
					value="84%"
					helper="Across foundations and primitives."
				/>
				<StatCard
					label="Velocity"
					value="12.4x"
					helper="Faster assembly with consistent tokens."
				/>
				<StatCard
					label="Adoption"
					value="28"
					helper="Internal views and usage experiments."
				/>
			</div>
		)
	}

	return (
		<div className="grid gap-4 lg:grid-cols-2">
			<BentoPanel
				eyebrow="Layout"
				title="Editorial hierarchy"
				description="Use stronger visual weight when content needs more storytelling than a default card."
				icon={<Blocks className="size-5" />}
				ctaLabel="Read pattern"
			/>
			<BentoPanel
				eyebrow="Feature"
				title="Composable by default"
				description="The panel stays generic enough for release notes, highlights, and showcase sections."
				icon={<Sparkles className="size-5" />}
				ctaLabel="Inspect API"
			/>
		</div>
	)
}

function renderPreview(slug: keyof typeof componentPages) {
	if (slug === "card") {
		return (
			<div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
				<Card variant="tertiary">
					<Card.Header>
						<Card.Eyebrow>Featured surface</Card.Eyebrow>
						<Card.Title>One card, multiple use cases</Card.Title>
						<Card.Description>
							Use content, slots, and variants to express hero tiles, supporting
							panels, or low-emphasis containers without introducing new
							component names for every domain.
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<div className="grid gap-3 sm:grid-cols-2">
							<StatusBadge label="UI system active" />
							<StatusBadge label="Release candidate" status="warning" />
						</div>
					</Card.Content>
					<Card.Footer>
						<Button>Read docs</Button>
						<Button variant="ghost">View tokens</Button>
					</Card.Footer>
				</Card>
				<div className="grid gap-4">
					<Card variant="secondary">
						<Card.Header>
							<Card.Eyebrow>Metric</Card.Eyebrow>
							<Card.Title>84%</Card.Title>
							<Card.Description>
								Design coverage across current pages.
							</Card.Description>
						</Card.Header>
					</Card>
					<Card variant="ghost">
						<Card.Header>
							<Card.Eyebrow>Note</Card.Eyebrow>
							<Card.Title>Low-chrome grouping</Card.Title>
							<Card.Description>
								Ghost cards help group content inside already elevated sections.
							</Card.Description>
						</Card.Header>
					</Card>
				</div>
			</div>
		)
	}

	if (slug === "navbar" || slug === "footer") {
		return (
			<div className="space-y-6">
				<Navbar
					brand="Monoline UI"
					links={[
						{ href: "#", label: "Docs" },
						{ href: "#", label: "Foundations" },
						{ href: "#", label: "Components" },
					]}
					actions={<Button variant="outline">Install</Button>}
				/>
				<Footer
					links={[
						{ href: "#", label: "GitHub" },
						{ href: "#", label: "npm" },
						{ href: "#", label: "License" },
					]}
				/>
			</div>
		)
	}

	if (slug === "status-badge") {
		return (
			<Card variant="secondary">
				<Card.Header>
					<Card.Eyebrow>Runtime state</Card.Eyebrow>
					<Card.Title>Lightweight status language</Card.Title>
					<Card.Description>
						Use the same component for availability, background jobs, or
						editorial flags instead of inventing one-off chips for each screen.
					</Card.Description>
				</Card.Header>
				<Card.Content className="flex flex-wrap gap-3">
					<StatusBadge label="Accepting work" />
					<StatusBadge label="In review" status="warning" />
					<StatusBadge label="Paused" status="neutral" />
				</Card.Content>
			</Card>
		)
	}

	if (slug === "section-header") {
		return (
			<SectionHeader
				eyebrow="Editorial shell"
				title="Lead with hierarchy, then slot actions where needed"
				description="SectionHeader gives docs pages and marketing layouts the same visual starting point without hand-building typography and spacing every time."
				actions={
					<>
						<Button>Primary action</Button>
						<Button variant="outline">Secondary action</Button>
					</>
				}
			/>
		)
	}

	if (slug === "stat-card") {
		return (
			<div className="grid gap-4 xl:grid-cols-4">
				<StatCard
					label="Tokens"
					value="28"
					helper="Color, type, spacing, and shadows."
				/>
				<StatCard
					label="Primitives"
					value="10"
					helper="Core reusable UI building blocks."
				/>
				<StatCard
					label="Themes"
					value="4"
					helper="Neutral-first palette families."
				/>
				<StatCard
					label="Modes"
					value="2"
					helper="Light and dark appearance layers."
				/>
			</div>
		)
	}

	if (slug === "bento-panel") {
		return (
			<div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
				<BentoPanel
					eyebrow="System"
					title="Build richer grids without special-case wrappers"
					description="A BentoPanel can carry feature copy, product highlights, launch notes, or any editorial surface that needs stronger hierarchy."
					icon={<Layers3 className="size-5" />}
					ctaLabel="Explore layout"
				/>
				<BentoPanel
					eyebrow="Token"
					title="Neutral palettes"
					description="Swap the base neutral family without rewriting component markup."
				/>
				<BentoPanel
					eyebrow="Docs"
					title="Reference-first"
					description="Use docs pages as the library surface instead of maintaining a separate story catalog."
				/>
			</div>
		)
	}

	if (slug === "badge") {
		return (
			<div className="flex flex-wrap gap-3">
				<Badge>Documentation</Badge>
				<Badge variant="secondary">Foundation</Badge>
				<Badge variant="outline">Component</Badge>
			</div>
		)
	}

	if (slug === "button") {
		return (
			<div className="flex flex-wrap gap-3">
				<Button>Primary action</Button>
				<Button variant="secondary">Secondary action</Button>
				<Button variant="outline">Outline action</Button>
				<Button variant="ghost">Ghost action</Button>
			</div>
		)
	}

	return (
		<div className="max-w-lg space-y-3">
			<Input placeholder="Enter your email" />
			<Button className="w-full">Continue</Button>
		</div>
	)
}

export default async function ComponentPage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const page = componentPages[slug as keyof typeof componentPages]

	if (!page) {
		notFound()
	}

	const typedSlug = slug as keyof typeof componentPages

	return (
		<DocsShell
			eyebrow="Component"
			title={page.title}
			description={page.description}
			toc={toc}
		>
			<section id="installation" className="docs-section">
				<CommandTabs />
			</section>

			<section id="usage" className="docs-section">
				<pre className="docs-code">
					<code>{`import { ${page.importName} } from "@chitrank2050/monoline-ui"\n\n${page.usage}`}</code>
				</pre>
			</section>

			<section id="examples" className="docs-section">
				<ComponentPreview
					code={`import { ${page.importName} } from "@chitrank2050/monoline-ui"\n\n${page.usage}`}
				>
					{renderApi(typedSlug)}
				</ComponentPreview>
			</section>

			<section id="preview" className="docs-section">
				<ComponentPreview
					code={`import { ${page.importName} } from "@chitrank2050/monoline-ui"\n\n// See full example in the documentation`}
				>
					{renderPreview(typedSlug)}
				</ComponentPreview>
			</section>
		</DocsShell>
	)
}
