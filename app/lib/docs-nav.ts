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
	{ href: "/foundations/colors", label: "Colors" },
	{ href: "/foundations/typography", label: "Typography" },
	{ href: "/foundations/spacing", label: "Spacing" },
	{ href: "/foundations/radius", label: "Radius" },
	{ href: "/foundations/motion", label: "Motion" },
] as const

export const guidesNav: DocsNavItem[] = [
	{
		href: "/accessibility",
		label: "Accessibility",
		description:
			"Keyboard behavior, screen-reader expectations, contrast, motion, and testing responsibilities.",
	},
	{
		href: "/theming",
		label: "Theming",
		description:
			"Adapt semantic tokens, fonts, and light, dark, or system behavior without forking components.",
	},
	{
		href: "/compatibility",
		label: "Compatibility",
		description:
			"Supported React, Next.js, Tailwind CSS, browser, and Server Component boundaries.",
	},
	{
		href: "/patterns",
		label: "Patterns",
		description:
			"Small, reusable compositions assembled from Monoline components and foundations.",
	},
] as const

export const componentNavGroups: DocsNavGroup[] = [
	{
		label: "Layout & structure",
		description: "Build page shells, sections, and content groupings.",
		items: [
			{
				href: "/components/card",
				label: "Card",
				description:
					"Compose linked, static, or button-backed editorial cards from image, body, footer, tag, and action slots.",
			},
			{
				href: "/components/media-frame",
				label: "MediaFrame",
				description:
					"Reserve stable media surfaces for images, video, placeholders, captions, and metadata.",
			},
			{
				href: "/components/section-head",
				label: "SectionHead",
				description:
					"Create section intros with eyebrow, title, subtitle, and size-based heading rhythm.",
			},
			{
				href: "/components/container",
				label: "Container",
				description:
					"Constrain page content with responsive max widths, horizontal padding tokens, and semantic element overrides.",
			},
			{
				href: "/components/action-rail",
				label: "ActionRail",
				description:
					"Group compact actions vertically or horizontally for toolbars, side rails, and social links.",
			},
			{
				href: "/components/separator",
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
				href: "/components/navbar",
				label: "Navbar",
				description:
					"Build responsive headers with brand, nav links, actions, sticky or glass styles, and a progress slot.",
			},
			{
				href: "/components/footer",
				label: "Footer",
				description:
					"Build responsive site footers with brand copy, link columns, subscribe actions, and meta rows.",
			},
			{
				href: "/components/back-link",
				label: "BackLink",
				description:
					"Render a compact return link with a leading line, muted default state, and accent hover treatment.",
			},
			{
				href: "/components/rail",
				label: "Rail",
				description:
					"Render vertical navigation lists for sidebars, filters, and secondary sections.",
			},
			{
				href: "/components/toc",
				label: "Toc",
				description:
					"Render document outline links with active-section tracking and optional collapsible mode.",
			},
			{
				href: "/components/command-search",
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
				href: "/components/dialog",
				label: "Dialog",
				description:
					"Open a modal surface with focus containment, Escape handling, background inertness, and focus restoration.",
			},
			{
				href: "/components/popover",
				label: "Popover",
				description:
					"Anchor contextual content to a trigger with collision-aware positioning and outside-interaction handling.",
			},
			{
				href: "/components/tooltip",
				label: "Tooltip",
				description:
					"Add short supporting context to focusable controls without replacing their accessible names.",
			},
			{
				href: "/components/dropdown-menu",
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
				href: "/components/button",
				label: "Button",
				description:
					"Render primary actions, secondary actions, icon buttons, loading states, and asChild links.",
			},
			{
				href: "/components/field",
				label: "Field",
				description:
					"Group a label, form control, supporting text, and validation message without hiding native semantics.",
			},
			{
				href: "/components/label",
				label: "Label",
				description:
					"Associate visible text with a form control and preserve native click-to-focus behavior.",
			},
			{
				href: "/components/input",
				label: "Input",
				description:
					"Render text fields with prefix and suffix slots, validation state, and consistent control sizing.",
			},
			{
				href: "/components/textarea",
				label: "Textarea",
				description:
					"Collect multi-line text with consistent sizing, validation styling, and controlled resize behavior.",
			},
			{
				href: "/components/checkbox",
				label: "Checkbox",
				description:
					"Represent independent checked, unchecked, and indeterminate choices with native keyboard behavior.",
			},
			{
				href: "/components/radio-group",
				label: "RadioGroup",
				description:
					"Choose one option from a visible set with arrow-key navigation and optional supporting descriptions.",
			},
			{
				href: "/components/select",
				label: "Select",
				description:
					"Render single-choice dropdowns for sorting, filtering, and view controls with mobile sheet behavior.",
			},
			{
				href: "/components/toggle",
				label: "Toggle",
				description:
					"Render controlled or uncontrolled switches with role=switch semantics and token-backed motion.",
			},
			{
				href: "/components/segmented-control",
				label: "SegmentedControl",
				description:
					"Render single-select controls with roving keyboard focus and default or pill variants.",
			},
			{
				href: "/components/theme-switcher",
				label: "ThemeSwitcher",
				description:
					"Render controlled light and dark theme controls in mini or full mode.",
			},
			{
				href: "/components/tag",
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
				href: "/components/badge",
				label: "Badge",
				description:
					"Label counts, statuses, and categories with compact size and variant controls.",
			},
			{
				href: "/components/avatar",
				label: "Avatar",
				description:
					"Render identity images or initials with fixed size tokens, fallback color, and slotted image support.",
			},
			{
				href: "/components/status",
				label: "Status",
				description:
					"Show compact state labels with a stable dot, tone, and optional pulse animation.",
			},
			{
				href: "/components/data-list",
				label: "DataList",
				description:
					"Render structured rows for stats, timelines, metadata, and compact content.",
			},
			{
				href: "/components/eyebrow",
				label: "Eyebrow",
				description:
					"Render compact section labels with mono text, uppercase rhythm, and predictable sizes.",
			},
			{
				href: "/components/metric",
				label: "Metric",
				description:
					"Show key numbers with labels, descriptions, and optional trend state.",
			},
			{
				href: "/components/meta-row",
				label: "MetaRow",
				description:
					"Render small inline metadata groups with mono text and separators.",
			},
			{
				href: "/components/changelog",
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
				href: "/components/pull-quote",
				label: "PullQuote",
				description:
					"Highlight long-form quotes with optional attribution and an accent border.",
			},
			{
				href: "/components/callout",
				label: "Callout",
				description:
					"Mark notes, tips, and warnings with clear labels and token-backed accents.",
			},
			{
				href: "/components/code-block",
				label: "CodeBlock",
				description:
					"Show preformatted code with an optional filename, language metadata, and copy action.",
			},
			{
				href: "/components/link-list",
				label: "LinkList",
				description:
					"Render compact resource and reading-list rows with dates, descriptions, and external-link handling.",
			},
			{
				href: "/components/resources-panel",
				label: "ResourcesPanel",
				description:
					"List project resources such as live links, source, docs, files, and videos in a compact sidebar.",
			},
			{
				href: "/components/testimonial",
				label: "Testimonial",
				description:
					"Render quotes with author metadata, avatar fallback, size, and surface variants.",
			},
			{
				href: "/components/testimonial-grid",
				label: "TestimonialGrid",
				description:
					"Arrange testimonial cards in aligned grid or masonry layouts without JavaScript measurement.",
			},
			{
				href: "/components/editorial-line",
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
				href: "/components/toast",
				label: "Toast",
				description:
					"Show status feedback banners with tone, message, and optional dismiss action.",
				meta: "beta",
			},
			{
				href: "/components/skeleton",
				label: "Skeleton",
				description:
					"Reserve loading space with rectangle, pill, circle, and text placeholder variants.",
			},
			{
				href: "/components/progress",
				label: "Progress",
				description:
					"Show determinate, indeterminate, or scroll-following progress bars for articles and workflows.",
			},
		],
	},
] as const

export const docsPagerNav: DocsNavItem[] = [
	{ href: "/", label: "Introduction" },
	{ href: "/installation", label: "Installation" },
	...guidesNav,
	{ href: "/foundations", label: "Foundations" },
	...foundationsNav,
	{ href: "/components", label: "Components" },
	...componentNavGroups.flatMap((group) => group.items),
	{ href: "/changelog", label: "Changelog" },
]

export const primaryNav: DocsNavItem[] = [
	{ href: "/installation", label: "Installation" },
	{ href: "/foundations", label: "Foundations" },
	{ href: "/components", label: "Components" },
	{ href: "/patterns", label: "Patterns" },
	{ href: "/changelog", label: "Changelog" },
] as const
