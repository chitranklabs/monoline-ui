import {
	Badge,
	BentoGrid,
	BentoPanel,
	Button,
	Card,
	Container,
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
import { PropsTable } from "../../../components/props-table"
import { ToggleButtonDemo } from "../../../components/toggle-button-demo"

const toc = [
	{ id: "installation", label: "Installation" },
	{ id: "usage", label: "Usage" },
	{ id: "examples", label: "Examples" },
	{ id: "api-reference", label: "API Reference" },
	{ id: "accessibility", label: "Accessibility" },
] as const

type ComponentPage = {
	title: string
	importName: string
	description: string
	usage: string
	examplesText: string
	props: readonly {
		name: string
		type: string
		default?: string
		description: string
	}[]
	a11y: string
}

const componentPages: Record<string, ComponentPage> = {
	badge: {
		title: "Badge",
		importName: "Badge",
		description: "Compact labels for metadata, categories, and small states.",
		usage: `<Badge variant="outline">Documentation</Badge>`,
		examplesText:
			"Badges support six variants for different visual emphasis. Use default for primary labels, secondary for muted tags, outline for bordered chips, destructive for error states, ghost for inline text, and link for clickable references.",
		props: [
			{
				name: "variant",
				type: '"default" | "secondary" | "outline" | "destructive" | "ghost" | "link"',
				default: '"default"',
				description:
					"Controls the visual style. Each variant maps to a specific background, border, and text color combination from the design tokens.",
			},
			{
				name: "className",
				type: "string",
				description: "Additional CSS classes merged via the cn utility.",
			},
			{
				name: "children",
				type: "ReactNode",
				description: "The label content rendered inside the badge.",
			},
		],
		a11y: "Badge renders as a <span> by default so it is purely presentational. When used to convey status, pair it with visually hidden text or an aria-label on the parent element so screen readers announce the meaning. Avoid using color alone to communicate state — combine with text labels.",
	},
	button: {
		title: "Button",
		importName: "Button",
		description: "Action surfaces with a clear primary-to-ghost hierarchy.",
		usage: `<Button variant="secondary">Save changes</Button>`,
		examplesText:
			"Buttons come in six variants and multiple sizes. The variant controls visual weight from primary (filled) through ghost (no chrome). Sizes range from xs to lg, plus dedicated icon sizes for square icon-only buttons.",
		props: [
			{
				name: "variant",
				type: '"default" | "secondary" | "outline" | "ghost" | "destructive" | "link"',
				default: '"default"',
				description:
					"Sets the visual hierarchy. Primary is filled, ghost has no background, destructive is for dangerous actions.",
			},
			{
				name: "size",
				type: '"xs" | "sm" | "default" | "lg" | "icon-xs" | "icon-sm" | "icon" | "icon-lg"',
				default: '"default"',
				description:
					"Controls height, padding, and font size. Icon sizes render as square buttons for icon-only use.",
			},
			{
				name: "asChild",
				type: "boolean",
				default: "false",
				description:
					"When true, the button merges its props onto its single child element instead of rendering a <button>. Useful for wrapping <a> tags.",
			},
			{
				name: "disabled",
				type: "boolean",
				default: "false",
				description: "Disables the button and applies reduced opacity styling.",
			},
		],
		a11y: "Button renders a native <button> element with full keyboard support — focusable via Tab, activated with Enter or Space. When using asChild to render a link, ensure the resulting element has the correct role. Use descriptive labels rather than generic text like 'Click here'. Disabled buttons remain in the focus order for discoverability.",
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
		examplesText:
			"Cards use a compound component pattern with dot notation. Combine Card.Header, Card.Title, Card.Description, Card.Content, and Card.Footer to compose any layout. Four variants control the visual emphasis from primary through ghost.",
		props: [
			{
				name: "variant",
				type: '"primary" | "secondary" | "tertiary" | "ghost"',
				default: '"primary"',
				description:
					"Controls the surface style — background color, border, and shadow intensity.",
			},
			{
				name: "className",
				type: "string",
				description: "Additional CSS classes merged onto the root element.",
			},
		],
		a11y: "Card renders as a <div> with data-slot attributes on each sub-component for styling hooks. For interactive cards, wrap the card in an <a> or add a click handler with role='button' and tabIndex={0}. Card.Title renders as an <h3> by default — ensure it fits your heading hierarchy. Use Card.Description for supplementary text that provides context.",
	},
	input: {
		title: "Input",
		importName: "Input",
		description:
			"Form fields tuned to the same spacing, radius, and focus rhythm.",
		usage: `<Input placeholder="name@company.com" />`,
		examplesText:
			"The Input component inherits all native input props. It includes consistent focus ring styling and supports all standard HTML input types including text, password, email, and number.",
		props: [
			{
				name: "type",
				type: "string",
				default: '"text"',
				description:
					"Standard HTML input type — text, email, password, number, search, tel, url, etc.",
			},
			{
				name: "placeholder",
				type: "string",
				description: "Hint text shown when the field is empty.",
			},
			{
				name: "disabled",
				type: "boolean",
				default: "false",
				description: "Disables the field and applies muted styling.",
			},
			{
				name: "className",
				type: "string",
				description: "Additional CSS classes merged onto the input element.",
			},
		],
		a11y: "Input renders a native <input> element with full keyboard and screen reader support. Always pair with a visible <label> element using htmlFor, or use aria-label for icon-only fields. The focus ring uses the design token ring color for consistent visibility. Required fields should use the required attribute and aria-required='true'.",
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
		examplesText:
			"The Navbar provides brand, navigation links, and an actions slot. It sticks to the top of the viewport with a backdrop blur. Pass any React node to the actions slot for buttons, toggles, or custom controls.",
		props: [
			{
				name: "brand",
				type: "ReactNode",
				description:
					"Brand content rendered on the left — typically a logo or site name string.",
			},
			{
				name: "links",
				type: "Array<{ href: string; label: string }>",
				description:
					"Navigation items rendered as anchor links in the center or right area.",
			},
			{
				name: "actions",
				type: "ReactNode",
				description:
					"Slot for action elements on the right side — buttons, toggles, or search.",
			},
		],
		a11y: "Navbar renders inside a <nav> landmark with aria-label for screen readers. Navigation links are rendered as native <a> elements. The sticky positioning keeps the navbar visible without stealing focus. For mobile, ensure a hamburger menu or equivalent pattern is used to expose navigation links.",
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
		examplesText:
			"Footer accepts a credit node and a list of link objects. The layout shifts from stacked on mobile to side-by-side on larger screens. Pair it with the Navbar for a complete page shell.",
		props: [
			{
				name: "credit",
				type: "ReactNode",
				description:
					"Attribution content — typically a copyright notice with the site or company name.",
			},
			{
				name: "links",
				type: "Array<{ href: string; label: string }>",
				description:
					"Utility links rendered as anchors — GitHub, license, social profiles, etc.",
			},
		],
		a11y: "Footer renders inside a <footer> landmark element which helps screen readers identify the end-of-page navigation. All links are native <a> tags with visible text labels. External links should include rel='noopener noreferrer' for security.",
	},
	"status-badge": {
		title: "Status Badge",
		importName: "StatusBadge",
		description:
			"A generic status chip for availability, state, and lightweight system feedback.",
		usage: `<StatusBadge label="Sync active" status="success" />`,
		examplesText:
			"StatusBadge renders a colored indicator dot next to a label. Three status values are available: success (green glow), warning (amber glow), and neutral (muted). Use it for availability, sync state, or lightweight system feedback.",
		props: [
			{
				name: "label",
				type: "string",
				description:
					"The text content displayed next to the status indicator dot.",
			},
			{
				name: "status",
				type: '"success" | "warning" | "neutral"',
				default: '"success"',
				description:
					"Controls the indicator dot color and glow — green for success, amber for warning, muted for neutral.",
			},
		],
		a11y: "The label text communicates the status meaning, so the component does not rely on color alone. The status dot uses aria-hidden since its meaning is conveyed through the label. For dynamic status updates, wrap in a live region (aria-live='polite') so changes are announced to screen readers.",
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
		examplesText:
			"SectionHeader provides a structured heading with optional eyebrow text, description, and an actions slot. Use the align prop to switch between left and center alignment for different page contexts.",
		props: [
			{
				name: "eyebrow",
				type: "string",
				description:
					"Small uppercase label above the title for categorization.",
			},
			{
				name: "title",
				type: "string",
				description: "Primary heading text rendered as an <h2>.",
			},
			{
				name: "description",
				type: "string",
				description:
					"Supporting paragraph below the title for additional context.",
			},
			{
				name: "actions",
				type: "ReactNode",
				description:
					"Slot for buttons or links rendered alongside the heading.",
			},
			{
				name: "align",
				type: '"left" | "center"',
				default: '"left"',
				description: "Controls text alignment for different page layouts.",
			},
		],
		a11y: "The title renders as an <h2> element — ensure it fits your document heading hierarchy. The eyebrow uses aria-hidden since it is decorative context for the title. Actions should use descriptive labels that make sense when read without the surrounding heading.",
	},
	"stat-card": {
		title: "Stat Card",
		importName: "StatCard",
		description:
			"A compact metric surface for product, trust, and benchmark content.",
		usage: `<StatCard label="Coverage" value="84%" helper="Across design tokens and primitives." />`,
		examplesText:
			"StatCard displays a label, large value, and optional helper text. The value uses monospace typography for alignment in grids. Stack multiple cards in a responsive grid for dashboard-style layouts.",
		props: [
			{
				name: "label",
				type: "string",
				description: "Metric name displayed above the value in muted text.",
			},
			{
				name: "value",
				type: "string",
				description:
					"The primary metric rendered in large monospace typography.",
			},
			{
				name: "helper",
				type: "string",
				description:
					"Optional explanatory text below the value for additional context.",
			},
		],
		a11y: "StatCard groups its label, value, and helper text in a single surface. The label provides context for the value, forming a natural reading order. For dashboards with many stat cards, consider using a heading level or aria-label on each card so screen readers can navigate between metrics.",
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
		examplesText:
			"BentoPanel supports an eyebrow, title, description, icon slot, and an optional CTA button. Use it inside BentoGrid for structured feature grids, or standalone for editorial highlights.",
		props: [
			{
				name: "eyebrow",
				type: "string",
				description: "Small uppercase label for categorization.",
			},
			{
				name: "title",
				type: "string",
				description: "Primary panel heading.",
			},
			{
				name: "description",
				type: "string",
				description: "Supporting text below the title.",
			},
			{
				name: "icon",
				type: "ReactNode",
				description:
					"Optional icon rendered above the eyebrow for visual interest.",
			},
			{
				name: "ctaLabel",
				type: "string",
				description:
					"When provided, renders a text button at the bottom of the panel.",
			},
		],
		a11y: "The panel renders as a <div> with structured heading content. When ctaLabel is provided, it renders as a native <button>. Icons use aria-hidden since they are decorative. For grid layouts, ensure panels have a logical reading order that matches the visual layout.",
	},
	"bento-grid": {
		title: "Bento Grid",
		importName: "BentoGrid",
		description:
			"A responsive grid wrapper for Bento panels with configurable column counts.",
		usage: `<BentoGrid columns={3}>
  <BentoPanel title="Feature one" description="First panel." />
  <BentoPanel title="Feature two" description="Second panel." />
  <BentoPanel title="Feature three" description="Third panel." />
</BentoGrid>`,
		examplesText:
			"BentoGrid provides a responsive CSS grid with 2, 3, or 4 column variants. The autoRows prop controls row height. Columns collapse to single-column on mobile and expand progressively at md and lg breakpoints.",
		props: [
			{
				name: "columns",
				type: "2 | 3 | 4",
				default: "3",
				description:
					"Number of columns at the largest breakpoint. Collapses to fewer columns on smaller screens.",
			},
			{
				name: "autoRows",
				type: "string",
				description:
					"CSS grid-auto-rows value for consistent row heights, e.g. '14rem'.",
			},
			{
				name: "className",
				type: "string",
				description: "Additional CSS classes merged onto the grid container.",
			},
		],
		a11y: "BentoGrid is a purely visual layout component — it does not add any ARIA roles. Content order in the DOM should match the intended reading order since CSS grid can visually reorder items. Ensure child panels maintain a logical sequence for keyboard and screen reader users.",
	},
	container: {
		title: "Container",
		importName: "Container",
		description:
			"A layout wrapper that constrains content width with consistent responsive padding.",
		usage: `<Container size="lg">
  <p>Your page content here.</p>
</Container>`,
		examplesText:
			"Container provides four size presets: sm (max-w-3xl), md (max-w-5xl), lg (max-w-7xl), and full (max-w-full). Each size includes consistent horizontal padding that adapts across breakpoints.",
		props: [
			{
				name: "size",
				type: '"sm" | "md" | "lg" | "full"',
				default: '"lg"',
				description:
					"Controls the max-width constraint — sm (48rem), md (64rem), lg (80rem), full (100%).",
			},
			{
				name: "className",
				type: "string",
				description:
					"Additional CSS classes merged onto the container element.",
			},
		],
		a11y: "Container is a purely structural layout element with no semantic meaning. It renders as a <div> and does not require any ARIA attributes. Content within the container should use appropriate semantic HTML elements.",
	},
	"toggle-button": {
		title: "Toggle Button",
		importName: "ToggleButton",
		description:
			"An animated binary toggle with a smooth sliding background and TypeScript generics.",
		usage: `<ToggleButton
  options={[
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ]}
  activeValue={mode}
  onChange={setMode}
/>`,
		examplesText:
			"ToggleButton accepts a generic type parameter for type-safe option values. It renders an animated sliding background that transitions smoothly between two options. Use it for theme toggles, view switchers, or any binary choice.",
		props: [
			{
				name: "options",
				type: "[ToggleOption<T>, ToggleOption<T>]",
				description:
					"Exactly two options, each with a value and label. The generic type T is inferred from the value type.",
			},
			{
				name: "activeValue",
				type: "T",
				description: "The currently selected option value.",
			},
			{
				name: "onChange",
				type: "(value: T) => void",
				description: "Callback fired when the user clicks an inactive option.",
			},
		],
		a11y: "ToggleButton renders as a group of native <button> elements with aria-pressed indicating the active state. Both options are focusable and can be activated with Enter or Space. The component uses role='group' for the container. Ensure the labels are descriptive enough to be understood without visual context.",
	},
}

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
				<Badge variant="destructive">Destructive</Badge>
				<Badge variant="ghost">Ghost</Badge>
				<Badge variant="link">Link</Badge>
			</div>
		)
	}

	if (slug === "button") {
		return (
			<div className="space-y-4">
				<div className="flex flex-wrap gap-3">
					<Button>Primary</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="destructive">Destructive</Button>
					<Button variant="link">Link</Button>
				</div>
				<div className="flex flex-wrap items-center gap-3">
					<Button size="xs">Extra small</Button>
					<Button size="sm">Small</Button>
					<Button>Default</Button>
					<Button size="lg">Large</Button>
				</div>
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

	if (slug === "bento-grid") {
		return (
			<BentoGrid columns={3} autoRows="14rem">
				<BentoPanel
					eyebrow="Layout"
					title="Three-column grid"
					description="Default column count for feature grids."
					icon={<Layers3 className="size-5" />}
				/>
				<BentoPanel
					eyebrow="Token"
					title="Neutral palettes"
					description="Swap the base neutral family without rewriting markup."
				/>
				<BentoPanel
					eyebrow="System"
					title="Composable panels"
					description="Each panel is independently configurable."
					icon={<Blocks className="size-5" />}
				/>
			</BentoGrid>
		)
	}

	if (slug === "container") {
		return (
			<div className="space-y-3">
				{(["sm", "md", "lg"] as const).map((size) => (
					<Container
						key={size}
						size={size}
						className="rounded-xl border border-dashed border-border/80 py-3 text-center"
					>
						<span className="text-muted-foreground font-mono text-xs">
							size="{size}"
						</span>
					</Container>
				))}
			</div>
		)
	}

	if (slug === "toggle-button") {
		return <ToggleButtonDemo />
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
				<h3 className="docs-section-title">Installation</h3>
				<p className="text-muted-foreground mb-4 text-sm">
					Install the package using your preferred package manager. All
					components are included in a single package — no individual installs
					needed.
				</p>
				<CommandTabs />
			</section>

			<section id="usage" className="docs-section">
				<h3 className="docs-section-title">Usage</h3>
				<p className="text-muted-foreground mb-4 text-sm">
					Import the component from the package and drop it into your JSX. The
					component is fully typed and tree-shakable.
				</p>
				<pre className="docs-code">
					<code>{`import { ${page.importName} } from "@chitrank2050/monoline-ui"\n\n${page.usage}`}</code>
				</pre>
			</section>

			<section id="examples" className="docs-section">
				<h3 className="docs-section-title">Examples</h3>
				<p className="text-muted-foreground mb-4 text-sm">
					{page.examplesText}
				</p>
				<ComponentPreview
					code={`import { ${page.importName} } from "@chitrank2050/monoline-ui"\n\n${page.usage}`}
				>
					{renderApi(typedSlug)}
				</ComponentPreview>
			</section>

			<section id="api-reference" className="docs-section">
				<h3 className="docs-section-title">API Reference</h3>
				<p className="text-muted-foreground mb-4 text-sm">
					Full list of props accepted by the{" "}
					<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
						{page.importName}
					</code>{" "}
					component. All standard HTML attributes are also forwarded to the
					underlying element.
				</p>
				<PropsTable props={page.props} />
			</section>

			<section id="accessibility" className="docs-section">
				<h3 className="docs-section-title">Accessibility</h3>
				<p className="text-muted-foreground text-sm leading-relaxed">
					{page.a11y}
				</p>
			</section>
		</DocsShell>
	)
}
