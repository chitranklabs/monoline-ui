import { blockPath, blocks } from "./blocks"
import { componentPath, routes } from "./routes"

export interface DocsNavItem {
	label: string
	href?: `/${string}`
	description?: string
	meta?: string
}

export interface DocsNavGroup {
	label: string
	description: string
	items: DocsNavItem[]
}

export const foundationsNav: DocsNavItem[] = [
	{ href: routes.docs.foundations.root, label: "Overview" },
	{ href: routes.docs.foundations.colors, label: "Colors" },
	{ href: routes.docs.foundations.typography, label: "Typography" },
	{ href: routes.docs.foundations.spacing, label: "Spacing" },
	{ href: routes.docs.foundations.radius, label: "Radius" },
	{ href: routes.docs.foundations.motion, label: "Motion" },
] as const

export const guidesNav: DocsNavItem[] = [
	{
		href: routes.docs.root,
		label: "Introduction",
		description:
			"Understand the package exports, theme contract, and server and client component boundaries.",
	},
	{
		href: routes.docs.installation,
		label: "Installation",
		description:
			"Install monoline/ui in a React project, configure Tailwind CSS v4, and import components.",
	},
	{
		href: routes.docs.accessibility,
		label: "Accessibility",
		description:
			"Keyboard behavior, screen-reader expectations, contrast, motion, and testing responsibilities.",
	},
	{
		href: routes.docs.theming,
		label: "Theming",
		description:
			"Adapt semantic tokens, fonts, and light, dark, or system behavior without forking components.",
	},
	{
		href: routes.docs.compatibility,
		label: "Compatibility",
		description:
			"Supported React, Next.js, Tailwind CSS, browser, and Server Component boundaries.",
	},
	{
		href: routes.docs.patterns,
		label: "Patterns",
		description:
			"Small, reusable compositions assembled from Monoline components and foundations.",
	},
] as const

export const componentNavGroups: DocsNavGroup[] = [
	{
		label: "Components",
		description: "Browse the full catalog of 47 typed React primitives.",
		items: [
			{
				href: routes.docs.components.root,
				label: "Overview",
				description: "Browse all 47 components by category.",
				meta: "47",
			},
		],
	},
	{
		label: "Layout & structure",
		description: "Build page shells, sections, and content groupings.",
		items: [
			{
				href: componentPath("card"),
				label: "Card",
				description:
					"Compose linked, static, or button-backed editorial cards from image, body, footer, tag, and action slots.",
			},
			{
				href: componentPath("media-frame"),
				label: "MediaFrame",
				description:
					"Reserve stable media surfaces for images, video, placeholders, captions, and metadata.",
			},
			{
				href: componentPath("section-head"),
				label: "SectionHead",
				description:
					"Create section intros with eyebrow, title, subtitle, and size-based heading rhythm.",
			},
			{
				href: componentPath("container"),
				label: "Container",
				description:
					"Constrain page content with responsive max widths, horizontal padding tokens, and semantic element overrides.",
			},
			{
				href: componentPath("action-rail"),
				label: "ActionRail",
				description:
					"Group compact actions vertically or horizontally for toolbars, side rails, and social links.",
			},
			{
				href: componentPath("separator"),
				label: "Separator",
				description:
					"Divide related content horizontally or vertically with decorative or semantic separator behavior.",
			},
		],
	},
	{
		label: "Navigation",
		description: "Help readers move around a site or within a long page.",
		items: [
			{
				href: componentPath("navbar"),
				label: "Navbar",
				description:
					"Build responsive headers with brand, nav links, actions, sticky or glass styles, and a progress slot.",
			},
			{
				href: componentPath("footer"),
				label: "Footer",
				description:
					"Build responsive site footers with brand copy, link columns, subscribe actions, and meta rows.",
			},
			{
				href: componentPath("back-link"),
				label: "BackLink",
				description:
					"Render a compact return link with a leading line, muted default state, and accent hover treatment.",
			},
			{
				href: componentPath("rail"),
				label: "Rail",
				description:
					"Render vertical navigation lists for sidebars, filters, and secondary sections.",
			},
			{
				href: componentPath("toc"),
				label: "Toc",
				description:
					"Render document outline links with active-section tracking and optional collapsible mode.",
			},
			{
				href: componentPath("command-search"),
				label: "CommandSearch",
				description:
					"Build a modal command palette with grouped results, filtering, keyboard navigation, and optional shortcut.",
			},
		],
	},
	{
		label: "Overlays & menus",
		description:
			"Layer contextual information and actions with managed focus and keyboard behavior.",
		items: [
			{
				href: componentPath("dialog"),
				label: "Dialog",
				description:
					"Open a modal surface with focus containment, Escape handling, background inertness, and focus restoration.",
			},
			{
				href: componentPath("popover"),
				label: "Popover",
				description:
					"Anchor contextual content to a trigger with collision-aware positioning and outside-interaction handling.",
			},
			{
				href: componentPath("tooltip"),
				label: "Tooltip",
				description:
					"Add short supporting context to focusable controls without replacing their accessible names.",
			},
			{
				href: componentPath("dropdown-menu"),
				label: "DropdownMenu",
				description:
					"Group secondary actions in a portal-mounted menu with roving focus, typeahead, and nested composition.",
			},
		],
	},
	{
		label: "Forms & inputs",
		description:
			"Collect values and give people clear, keyboard-friendly controls.",
		items: [
			{
				href: componentPath("button"),
				label: "Button",
				description:
					"Render primary actions, secondary actions, icon buttons, loading states, and asChild links.",
			},
			{
				href: componentPath("field"),
				label: "Field",
				description:
					"Group a label, form control, supporting text, and validation message without hiding native semantics.",
			},
			{
				href: componentPath("label"),
				label: "Label",
				description:
					"Associate visible text with a form control and preserve native click-to-focus behavior.",
			},
			{
				href: componentPath("input"),
				label: "Input",
				description:
					"Render text fields with prefix and suffix slots, validation state, and consistent control sizing.",
			},
			{
				href: componentPath("textarea"),
				label: "Textarea",
				description:
					"Collect multi-line text with consistent sizing, validation styling, and controlled resize behavior.",
			},
			{
				href: componentPath("checkbox"),
				label: "Checkbox",
				description:
					"Represent independent checked, unchecked, and indeterminate choices with native keyboard behavior.",
			},
			{
				href: componentPath("radio-group"),
				label: "RadioGroup",
				description:
					"Choose one option from a visible set with arrow-key navigation and optional supporting descriptions.",
			},
			{
				href: componentPath("select"),
				label: "Select",
				description:
					"Render single-choice dropdowns for sorting, filtering, and view controls with mobile sheet behavior.",
			},
			{
				href: componentPath("toggle"),
				label: "Toggle",
				description:
					"Render controlled or uncontrolled switches with role=switch semantics and token-backed motion.",
			},
			{
				href: componentPath("segmented-control"),
				label: "SegmentedControl",
				description:
					"Render single-select controls with roving keyboard focus and default or pill variants.",
			},
			{
				href: componentPath("theme-switcher"),
				label: "ThemeSwitcher",
				description:
					"Render controlled light and dark theme controls in mini or full mode.",
			},
			{
				href: componentPath("tag"),
				label: "Tag",
				description:
					"Render filter buttons for categories, stacks, and metadata.",
			},
		],
	},
	{
		label: "Display",
		description:
			"Present identity, status, metadata, and small pieces of data.",
		items: [
			{
				href: componentPath("badge"),
				label: "Badge",
				description:
					"Label counts, statuses, and categories with compact size and variant controls.",
			},
			{
				href: componentPath("avatar"),
				label: "Avatar",
				description:
					"Render identity images or initials with fixed size tokens, fallback color, and slotted image support.",
			},
			{
				href: componentPath("status"),
				label: "Status",
				description:
					"Show compact state labels with a stable dot, tone, and optional pulse animation.",
			},
			{
				href: componentPath("data-list"),
				label: "DataList",
				description:
					"Render structured rows for stats, timelines, metadata, and compact content.",
			},
			{
				href: componentPath("eyebrow"),
				label: "Eyebrow",
				description:
					"Render compact section labels with mono text, uppercase rhythm, and predictable sizes.",
			},
			{
				href: componentPath("metric"),
				label: "Metric",
				description:
					"Show key numbers with labels, descriptions, and optional trend state.",
			},
			{
				href: componentPath("meta-row"),
				label: "MetaRow",
				description:
					"Render small inline metadata groups with mono text and separators.",
			},
			{
				href: componentPath("changelog"),
				label: "ChangelogTimeline",
				description:
					"Turn git-cliff JSON into a categorized release timeline with stable dates and GitHub links.",
			},
		],
	},
	{
		label: "Content",
		description:
			"Structure articles, documentation, quotes, and supporting links.",
		items: [
			{
				href: componentPath("pull-quote"),
				label: "PullQuote",
				description:
					"Highlight long-form quotes with optional attribution and an accent border.",
			},
			{
				href: componentPath("callout"),
				label: "Callout",
				description:
					"Mark notes, tips, and warnings with clear labels and token-backed accents.",
			},
			{
				href: componentPath("code-block"),
				label: "CodeBlock",
				description:
					"Show preformatted code with an optional filename, language metadata, and copy action.",
			},
			{
				href: componentPath("link-list"),
				label: "LinkList",
				description:
					"Render compact resource and reading-list rows with dates, descriptions, and external-link handling.",
			},
			{
				href: componentPath("resources-panel"),
				label: "ResourcesPanel",
				description:
					"List project resources such as live links, source, docs, files, and videos in a compact sidebar.",
			},
			{
				href: componentPath("testimonial"),
				label: "Testimonial",
				description:
					"Render quotes with author metadata, avatar fallback, size, and surface variants.",
			},
			{
				href: componentPath("testimonial-grid"),
				label: "TestimonialGrid",
				description:
					"Arrange testimonial cards in aligned grid or masonry layouts without JavaScript measurement.",
			},
			{
				href: componentPath("editorial-line"),
				label: "EditorialLine",
				description:
					"Render publication rows with index, date, title, summary, tag, and action metadata.",
			},
		],
	},
	{
		label: "Feedback",
		description: "Show loading, progress, and the result of an action.",
		items: [
			{
				href: componentPath("toast"),
				label: "Toast",
				description:
					"Show status feedback banners with tone, message, and optional dismiss action.",
				meta: "beta",
			},
			{
				href: componentPath("skeleton"),
				label: "Skeleton",
				description:
					"Reserve loading space with rectangle, pill, circle, and text placeholder variants.",
			},
			{
				href: componentPath("progress"),
				label: "Progress",
				description:
					"Show determinate, indeterminate, or scroll-following progress bars for articles and workflows.",
			},
		],
	},
] as const

function sortNavItems(items: readonly DocsNavItem[]): DocsNavItem[] {
	return [...items].sort((left, right) =>
		left.label.localeCompare(right.label, "en", { sensitivity: "base" })
	)
}

function sortNavItemsWithoutOverview(
	items: readonly DocsNavItem[],
	overviewHref: `/${string}`
): DocsNavItem[] {
	return sortNavItems(items.filter((item) => item.href !== overviewHref))
}

export const sectionsNav: DocsNavItem[] = [
	...guidesNav.slice(0, 2),
	{ href: routes.docs.foundations.root, label: "Foundation" },
	{ href: routes.docs.components.root, label: "Components" },
	{ href: routes.docs.blocks.root, label: "Blocks" },
	...guidesNav.slice(2),
	{ href: routes.docs.changelog, label: "Changelog" },
]

export const foundationsSidebarNav: DocsNavItem[] = sortNavItemsWithoutOverview(
	foundationsNav,
	routes.docs.foundations.root
)

export const componentsNav: DocsNavItem[] = sortNavItemsWithoutOverview(
	componentNavGroups.flatMap((group) => group.items),
	routes.docs.components.root
)

export const docsPagerNav: DocsNavItem[] = [
	...guidesNav,
	{ href: routes.docs.blocks.root, label: "Blocks" },
	...blocks.map((block) => ({
		href: blockPath(block.name),
		label: block.title,
	})),
	...foundationsNav,
	...componentNavGroups.flatMap((group) => group.items),
	{ href: routes.docs.changelog, label: "Changelog" },
]

export const primaryNav: DocsNavItem[] = [
	{ href: routes.docs.root, label: "Docs" },
	{ href: routes.docs.components.root, label: "Components" },
	{ href: routes.docs.foundations.root, label: "Foundations" },
] as const
