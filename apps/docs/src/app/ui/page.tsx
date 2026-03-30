import { themeModes, typographyScale } from "@chitrank2050/monoline-tokens"
import {
	Badge,
	BentoPanel,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Input,
	SectionHeader,
	StatCard,
} from "@chitrank2050/monoline-ui"
import {
	Blocks,
	ChartNoAxesColumn,
	Layers3,
	Palette,
	PanelTop,
	Sparkles,
} from "lucide-react"

import { PaletteSwitcher } from "../../components/palette-switcher"
import { ThemeToggle } from "../../components/theme-toggle"

const navigationGroups = [
	{
		title: "Getting Started",
		items: [
			{ id: "introduction", label: "Introduction" },
			{ id: "installation", label: "Installation" },
			{ id: "theming", label: "Theming" },
		],
	},
	{
		title: "Foundations",
		items: [
			{ id: "colors", label: "Colors" },
			{ id: "typography", label: "Typography" },
			{ id: "spacing", label: "Spacing" },
		],
	},
	{
		title: "Components",
		items: [
			{ id: "badge", label: "Badge" },
			{ id: "button", label: "Button" },
			{ id: "card", label: "Card" },
			{ id: "input", label: "Input" },
			{ id: "section-header", label: "Section Header" },
			{ id: "stat-card", label: "Stat Card" },
			{ id: "bento-panel", label: "Bento Panel" },
		],
	},
] as const

const spacingScale = [
	{ label: "2", value: "0.5rem", width: "2rem" },
	{ label: "4", value: "1rem", width: "4rem" },
	{ label: "6", value: "1.5rem", width: "6rem" },
	{ label: "8", value: "2rem", width: "8rem" },
	{ label: "12", value: "3rem", width: "12rem" },
	{ label: "16", value: "4rem", width: "16rem" },
] as const

function CodeBlock({ code }: { code: string }) {
	return (
		<pre className="docs-code">
			<code>{code}</code>
		</pre>
	)
}

function DocsSection({
	id,
	eyebrow,
	title,
	description,
	children,
}: {
	id: string
	eyebrow: string
	title: string
	description: string
	children: React.ReactNode
}) {
	return (
		<section id={id} className="docs-section">
			<SectionHeader
				eyebrow={eyebrow}
				title={title}
				description={description}
			/>
			<div className="mt-6">{children}</div>
		</section>
	)
}

export default function UiPage() {
	return (
		<div className="shell py-6 sm:py-8">
			<div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
				<aside className="lg:sticky lg:top-6 lg:self-start">
					<div className="panel p-4 sm:p-5">
						<div className="mb-6 space-y-3">
							<div className="flex items-center justify-between gap-3">
								<div>
									<p className="font-script text-primary text-2xl leading-none">
										Monoline UI
									</p>
									<p className="text-muted-foreground mt-2 text-sm leading-6">
										Docs-first design system explorer.
									</p>
								</div>
								<Badge variant="outline" className="rounded-full font-mono">
									v0
								</Badge>
							</div>
							<div className="space-y-3 border-t pt-4">
								<div>
									<p className="label-eyebrow mb-2">Appearance</p>
									<ThemeToggle />
								</div>
								<div>
									<p className="label-eyebrow mb-2">Palette</p>
									<PaletteSwitcher />
								</div>
							</div>
						</div>

						<nav className="space-y-6">
							{navigationGroups.map((group) => (
								<div key={group.title}>
									<p className="label-eyebrow mb-3">{group.title}</p>
									<div className="space-y-1">
										{group.items.map((item) => (
											<a
												key={item.id}
												href={`#${item.id}`}
												className="docs-nav-link"
											>
												{item.label}
											</a>
										))}
									</div>
								</div>
							))}
						</nav>
					</div>
				</aside>

				<main className="min-w-0">
					<div className="panel overflow-hidden">
						<div className="border-b px-6 py-5 sm:px-8">
							<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
								<div className="space-y-3">
									<Badge variant="outline" className="rounded-full font-mono">
										UI Explorer
									</Badge>
									<h1 className="max-w-3xl font-mono text-4xl font-semibold tracking-tight sm:text-5xl">
										Docs for the system itself, not just a pile of stories.
									</h1>
									<p className="text-muted-foreground max-w-3xl text-base leading-7">
										Monoline UI should feel closer to shadcn's docs model:
										foundations, installation, theming, and components all in
										one clear navigation flow.
									</p>
								</div>
								<div className="flex flex-wrap gap-3">
									<Button asChild>
										<a href="#components">Browse components</a>
									</Button>
									<Button asChild variant="outline">
										<a href="#installation">Install package</a>
									</Button>
								</div>
							</div>
						</div>

						<div className="px-6 py-6 sm:px-8 sm:py-8">
							<DocsSection
								id="introduction"
								eyebrow="Overview"
								title="A modular UI library with a docs-first presentation layer"
								description="The public experience should explain the system, not just expose isolated controls."
							>
								<div className="grid gap-4 md:grid-cols-3">
									<BentoPanel
										eyebrow="Foundation"
										title="Neutral-first theming"
										description="Light, dark, and palette modes aligned with Tailwind and shadcn naming."
										icon={<Palette className="size-5" />}
									/>
									<BentoPanel
										eyebrow="Composition"
										title="Reusable sections"
										description="Patterns like SectionHeader, StatCard, and BentoPanel help the library feel authored, not generic."
										icon={<Layers3 className="size-5" />}
									/>
									<BentoPanel
										eyebrow="Shipping"
										title="Built to publish"
										description="The workspace is organized so docs, tokens, and the public package evolve cleanly."
										icon={<Sparkles className="size-5" />}
									/>
								</div>
							</DocsSection>

							<DocsSection
								id="installation"
								eyebrow="Setup"
								title="Install the package"
								description="The public package is designed for Next.js and Vite with one CSS entrypoint."
							>
								<div className="grid gap-4 xl:grid-cols-2">
									<Card className="rounded-[1.75rem]">
										<CardHeader>
											<CardTitle>Package install</CardTitle>
											<CardDescription>
												Add the public library from npm.
											</CardDescription>
										</CardHeader>
										<CardContent>
											<CodeBlock code={`pnpm add @chitrank2050/monoline-ui`} />
										</CardContent>
									</Card>
									<Card className="rounded-[1.75rem]">
										<CardHeader>
											<CardTitle>Theme import</CardTitle>
											<CardDescription>
												Import the shared CSS once near your app root.
											</CardDescription>
										</CardHeader>
										<CardContent>
											<CodeBlock
												code={`import "@chitrank2050/monoline-ui/theme.css"`}
											/>
										</CardContent>
									</Card>
								</div>
								<div className="mt-4">
									<Card className="rounded-[1.75rem]">
										<CardHeader>
											<CardTitle>Usage</CardTitle>
											<CardDescription>
												Compose sections with shared tokens and primitives.
											</CardDescription>
										</CardHeader>
										<CardContent>
											<CodeBlock
												code={`import { Button, SectionHeader } from "@chitrank2050/monoline-ui"

export function Hero() {
	return (
		<section>
			<SectionHeader
				eyebrow="System"
				title="Consistent interface building blocks"
				description="Ship polished sections faster with a shared visual language."
			/>
			<Button>Explore components</Button>
		</section>
	)
}`}
											/>
										</CardContent>
									</Card>
								</div>
							</DocsSection>

							<DocsSection
								id="theming"
								eyebrow="Theming"
								title="Appearance and palette modes"
								description="Use light and dark for appearance, then switch the neutral family to tune the mood."
							>
								<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
									{themeModes.map((theme) => (
										<Card key={theme.id} className="rounded-[1.75rem]">
											<CardHeader>
												<CardTitle>{theme.label}</CardTitle>
												<CardDescription>{theme.description}</CardDescription>
											</CardHeader>
											<CardContent>
												<div className="flex gap-2">
													{theme.swatches.map((swatch) => (
														<div
															key={swatch}
															className="size-10 rounded-full border border-black/10"
															style={{ backgroundColor: swatch }}
														/>
													))}
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</DocsSection>

							<DocsSection
								id="colors"
								eyebrow="Foundations"
								title="Semantic colors"
								description="Monoline uses semantic tokens so components respond to theme changes without rewriting classes."
							>
								<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
									{[
										{
											label: "Primary",
											className: "bg-primary text-primary-foreground",
										},
										{
											label: "Secondary",
											className: "bg-secondary text-secondary-foreground",
										},
										{
											label: "Muted",
											className: "bg-muted text-muted-foreground",
										},
										{
											label: "Card",
											className: "bg-card text-card-foreground border",
										},
									].map((swatch) => (
										<div
											key={swatch.label}
											className={`rounded-[1.5rem] p-5 ${swatch.className}`}
										>
											<p className="label-eyebrow mb-3 opacity-80">Token</p>
											<p className="font-mono text-lg font-semibold">
												{swatch.label}
											</p>
										</div>
									))}
								</div>
							</DocsSection>

							<DocsSection
								id="typography"
								eyebrow="Foundations"
								title="Typography"
								description="A readable sans, structured mono, and signature script give the system range without losing coherence."
							>
								<Card className="rounded-[1.75rem]">
									<CardContent className="space-y-4 pt-6">
										{typographyScale.map((item) => (
											<div
												key={item.label}
												className="border-border/70 flex items-end justify-between gap-4 border-b pb-4 last:border-b-0"
											>
												<div>
													<p className={item.className}>{item.preview}</p>
													<p className="text-muted-foreground mt-2 text-sm">
														{item.label}
													</p>
												</div>
												<code className="text-muted-foreground font-mono text-xs">
													{item.token}
												</code>
											</div>
										))}
									</CardContent>
								</Card>
							</DocsSection>

							<DocsSection
								id="spacing"
								eyebrow="Foundations"
								title="Spacing"
								description="Compact but generous enough for marketing sections, cards, and dashboard surfaces."
							>
								<Card className="rounded-[1.75rem]">
									<CardContent className="space-y-4 pt-6">
										{spacingScale.map((item) => (
											<div key={item.label} className="flex items-center gap-4">
												<code className="text-muted-foreground w-10 font-mono text-xs">
													{item.label}
												</code>
												<div
													className="bg-primary/75 h-3 rounded-full"
													style={{ width: item.width }}
												/>
												<span className="text-muted-foreground text-sm">
													{item.value}
												</span>
											</div>
										))}
									</CardContent>
								</Card>
							</DocsSection>

							<DocsSection
								id="components"
								eyebrow="Library"
								title="Components"
								description="Public-facing primitives and patterns should be browseable from one navigation model."
							>
								<div className="grid gap-4 xl:grid-cols-2">
									<Card id="badge" className="rounded-[1.75rem]">
										<CardHeader>
											<CardTitle>Badge</CardTitle>
											<CardDescription>
												Compact state and label surfaces.
											</CardDescription>
										</CardHeader>
										<CardContent className="flex flex-wrap gap-3">
											<Badge>Default</Badge>
											<Badge variant="secondary">Secondary</Badge>
											<Badge variant="outline">Outline</Badge>
										</CardContent>
									</Card>

									<Card id="button" className="rounded-[1.75rem]">
										<CardHeader>
											<CardTitle>Button</CardTitle>
											<CardDescription>
												Primary and supporting actions.
											</CardDescription>
										</CardHeader>
										<CardContent className="flex flex-wrap gap-3">
											<Button>Primary</Button>
											<Button variant="secondary">Secondary</Button>
											<Button variant="outline">Outline</Button>
											<Button variant="ghost">Ghost</Button>
										</CardContent>
									</Card>

									<Card id="card" className="rounded-[1.75rem]">
										<CardHeader>
											<CardTitle>Card</CardTitle>
											<CardDescription>
												The default surface shell for content blocks.
											</CardDescription>
										</CardHeader>
										<CardContent>
											<Card className="bg-background rounded-[1.5rem]">
												<CardHeader>
													<CardTitle>Nested surface</CardTitle>
													<CardDescription>
														Useful for demos, callouts, and documentation
														panels.
													</CardDescription>
												</CardHeader>
											</Card>
										</CardContent>
									</Card>

									<Card id="input" className="rounded-[1.75rem]">
										<CardHeader>
											<CardTitle>Input</CardTitle>
											<CardDescription>
												Form controls should feel aligned with the rest of the
												system.
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-3">
											<Input placeholder="name@company.com" />
											<Button className="w-full">Request access</Button>
										</CardContent>
									</Card>

									<Card
										id="section-header"
										className="rounded-[1.75rem] xl:col-span-2"
									>
										<CardHeader>
											<CardTitle>Section Header</CardTitle>
											<CardDescription>
												Reusable heading pattern for docs, landing pages, and
												showcase sections.
											</CardDescription>
										</CardHeader>
										<CardContent>
											<SectionHeader
												eyebrow="Pattern"
												title="A section shell that keeps pages visually consistent"
												description="This belongs in docs first, because it explains how the system composes beyond low-level primitives."
												actions={
													<>
														<Button size="sm">Inspect</Button>
														<Button size="sm" variant="outline">
															Usage
														</Button>
													</>
												}
											/>
										</CardContent>
									</Card>

									<Card id="stat-card" className="rounded-[1.75rem]">
										<CardHeader>
											<CardTitle>Stat Card</CardTitle>
											<CardDescription>
												Compact metric surfaces for benchmarks and proof points.
											</CardDescription>
										</CardHeader>
										<CardContent>
											<StatCard
												label="Coverage"
												value="84%"
												helper="A compact metric card for dashboards, landing sections, and benchmarks."
											/>
										</CardContent>
									</Card>

									<Card id="bento-panel" className="rounded-[1.75rem]">
										<CardHeader>
											<CardTitle>Bento Panel</CardTitle>
											<CardDescription>
												Expressive content tiles for feature grids and modular
												layouts.
											</CardDescription>
										</CardHeader>
										<CardContent>
											<BentoPanel
												eyebrow="Layout"
												title="BentoPanel"
												description="Use this when a plain card is too quiet and the section needs a stronger editorial voice."
												icon={<Blocks className="size-5" />}
												ctaLabel="See pattern"
											/>
										</CardContent>
									</Card>
								</div>
							</DocsSection>

							<DocsSection
								id="patterns"
								eyebrow="Patterns"
								title="System components beyond primitives"
								description="A design library gets more valuable when it captures composition patterns, not just isolated atoms."
							>
								<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
									<BentoPanel
										eyebrow="Section"
										title="SectionHeader"
										description="Reusable heading pattern for docs pages and landing sections."
										icon={<PanelTop className="size-5" />}
										ctaLabel="Pattern"
									/>
									<BentoPanel
										eyebrow="Metric"
										title="StatCard"
										description="Compact KPI surfaces for credibility and status snapshots."
										icon={<ChartNoAxesColumn className="size-5" />}
										ctaLabel="Pattern"
									/>
									<BentoPanel
										eyebrow="Grid"
										title="BentoPanel"
										description="Editorial tile that adds more character than a neutral content card."
										icon={<Blocks className="size-5" />}
										ctaLabel="Pattern"
									/>
								</div>
							</DocsSection>
						</div>
					</div>
				</main>
			</div>
		</div>
	)
}
