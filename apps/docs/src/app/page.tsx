import {
	accentThemes,
	foundationGroups,
	spacingScale,
	typographyScale,
} from "@foundry/tokens"
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Input,
} from "@foundry/ui"
import {
	ArrowUpRight,
	Layers3,
	MoonStar,
	Palette,
	Sparkles,
} from "lucide-react"

import { AccentSwitcher } from "../components/accent-switcher"
import { ThemeToggle } from "../components/theme-toggle"

const pillars = [
	{
		title: "Foundations first",
		description:
			"Color, type, motion, radius, and spacing are treated as reusable product decisions, not ad hoc page styling.",
		icon: Palette,
	},
	{
		title: "Component craft",
		description:
			"Primitives stay shadcn-compatible while carrying a sharper visual identity shaped by the portfolio's tone.",
		icon: Layers3,
	},
	{
		title: "Built for shipping",
		description:
			"The repo starts as a modular monorepo so docs, tokens, and components can evolve without collapsing into one app.",
		icon: Sparkles,
	},
]

export default function HomePage() {
	return (
		<main className="pb-20">
			<section className="shell pt-8 sm:pt-10">
				<div className="panel overflow-hidden">
					<div className="grid gap-10 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-14">
						<div className="space-y-6">
							<Badge
								variant="outline"
								className="rounded-full px-3 py-1 font-mono"
							>
								Foundry UI v0
							</Badge>
							<div className="space-y-4">
								<p className="font-script text-primary text-3xl leading-none sm:text-4xl">
									Design system in progress
								</p>
								<h1 className="max-w-3xl text-balance font-mono text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
									A blueprint for interface decisions, not just a component
									dump.
								</h1>
								<p className="text-muted-foreground max-w-2xl text-base leading-7 sm:text-lg">
									This workspace turns the portfolio's visual language into
									reusable tokens, polished UI primitives, and a docs site that
									can grow into your public design library.
								</p>
							</div>

							<div className="flex flex-wrap items-center gap-3">
								<Button size="lg">Explore Foundations</Button>
								<Button size="lg" variant="outline">
									Storybook Next
									<ArrowUpRight className="size-4" />
								</Button>
							</div>
						</div>

						<div className="grid gap-4 self-start sm:grid-cols-2">
							<div className="panel space-y-4 p-5">
								<div className="flex items-center justify-between">
									<p className="label-eyebrow">Mode</p>
									<MoonStar className="text-muted-foreground size-4" />
								</div>
								<ThemeToggle />
								<p className="text-muted-foreground text-sm leading-6">
									Light and dark mode are first-class themes, not retrofitted
									overrides.
								</p>
							</div>
							<div className="panel space-y-4 p-5">
								<div className="flex items-center justify-between">
									<p className="label-eyebrow">Accent</p>
									<Palette className="text-muted-foreground size-4" />
								</div>
								<AccentSwitcher />
								<p className="text-muted-foreground text-sm leading-6">
									Each accent shifts the brand expression while preserving the
									same scale and component rules.
								</p>
							</div>
							<div className="panel p-5 sm:col-span-2">
								<p className="label-eyebrow mb-4">System Notes</p>
								<div className="grid gap-3 sm:grid-cols-3">
									{pillars.map(({ icon: Icon, title, description }) => (
										<div
											key={title}
											className="bg-muted/50 rounded-2xl border border-white/5 p-4"
										>
											<Icon className="text-primary mb-3 size-5" />
											<p className="mb-2 font-medium">{title}</p>
											<p className="text-muted-foreground text-sm leading-6">
												{description}
											</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="shell mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
				<Card className="rounded-[2rem]">
					<CardHeader>
						<CardTitle>Foundations</CardTitle>
						<CardDescription>
							The repo starts with the design rules your components should
							inherit.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-5">
						{foundationGroups.map((group) => (
							<div key={group.title} className="space-y-2">
								<p className="label-eyebrow">{group.title}</p>
								<ul className="text-muted-foreground space-y-2 text-sm leading-6">
									{group.items.map((item) => (
										<li key={item}>{item}</li>
									))}
								</ul>
							</div>
						))}
					</CardContent>
				</Card>

				<div className="grid gap-6">
					<Card className="rounded-[2rem]">
						<CardHeader>
							<CardTitle>Accent palettes</CardTitle>
							<CardDescription>
								These are starter color personalities for the system showcase.
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 md:grid-cols-3">
							{accentThemes.map((theme) => (
								<div
									key={theme.id}
									className="bg-muted/50 rounded-2xl border p-4"
								>
									<div className="mb-4 flex gap-2">
										{theme.swatches.map((swatch) => (
											<div
												key={swatch}
												className="size-8 rounded-full border border-black/10"
												style={{ backgroundColor: swatch }}
											/>
										))}
									</div>
									<p className="mb-1 font-medium">{theme.label}</p>
									<p className="text-muted-foreground text-sm leading-6">
										{theme.description}
									</p>
								</div>
							))}
						</CardContent>
					</Card>

					<div className="grid gap-6 lg:grid-cols-2">
						<Card className="rounded-[2rem]">
							<CardHeader>
								<CardTitle>Type scale</CardTitle>
								<CardDescription>
									Expressive script, structured mono, and readable sans.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3">
								{typographyScale.map((item) => (
									<div
										key={item.label}
										className="border-border/70 flex items-baseline justify-between gap-4 border-b pb-3"
									>
										<div>
											<p className={item.className}>{item.preview}</p>
											<p className="text-muted-foreground mt-1 text-xs">
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

						<Card className="rounded-[2rem]">
							<CardHeader>
								<CardTitle>Spacing scale</CardTitle>
								<CardDescription>
									A compact system tuned for dashboards, landing pages, and
									editorial sections.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3">
								{spacingScale.map((item) => (
									<div key={item.token} className="flex items-center gap-4">
										<code className="text-muted-foreground w-12 font-mono text-xs">
											{item.token}
										</code>
										<div
											className="bg-primary/70 h-3 rounded-full"
											style={{ width: item.preview }}
										/>
										<span className="text-muted-foreground text-sm">
											{item.rem}
										</span>
									</div>
								))}
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			<section className="shell mt-8">
				<Card className="rounded-[2rem]">
					<CardHeader>
						<CardTitle>Component lab</CardTitle>
						<CardDescription>
							A starter set of primitives that already reflect the system.
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
						<div className="grid gap-4 md:grid-cols-2">
							<Card className="bg-background rounded-[1.5rem]">
								<CardHeader>
									<CardTitle>Surface card</CardTitle>
									<CardDescription>
										Soft elevation, generous radius, and token-driven contrast.
									</CardDescription>
								</CardHeader>
								<CardContent className="flex flex-wrap gap-3">
									<Button>Primary</Button>
									<Button variant="secondary">Secondary</Button>
									<Button variant="outline">Outline</Button>
									<Button variant="ghost">Ghost</Button>
								</CardContent>
							</Card>

							<Card className="bg-background rounded-[1.5rem]">
								<CardHeader>
									<CardTitle>Form controls</CardTitle>
									<CardDescription>
										Input, helper text, and call-to-action flow.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									<Input placeholder="name@company.com" />
									<Button className="w-full">Request access</Button>
								</CardContent>
							</Card>
						</div>

						<div className="panel flex flex-col justify-between gap-6 p-6">
							<div className="space-y-3">
								<p className="label-eyebrow">Roadmap</p>
								<h2 className="font-mono text-2xl font-semibold">
									What comes next
								</h2>
								<p className="text-muted-foreground text-sm leading-6">
									Add section headers, navigation patterns, portfolio cards,
									bento layouts, and template pages lifted from the strongest
									compositions in the current portfolio.
								</p>
							</div>

							<div className="space-y-3">
								<Badge>Next.js ready</Badge>
								<Badge variant="secondary">Storybook wired</Badge>
								<Badge variant="outline">Token driven</Badge>
							</div>
						</div>
					</CardContent>
				</Card>
			</section>
		</main>
	)
}
