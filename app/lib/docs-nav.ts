export interface DocsNavItem {
	label: string
	href?: string
	meta?: string
}

export interface DocsNavGroup {
	label: string
	items: DocsNavItem[]
}

export const primaryNav: DocsNavItem[] = [
	{ href: "/", label: "Introduction" },
	{ href: "/installation", label: "Installation" },
	{ href: "/foundations/colors", label: "Foundations" },
	{ href: "/components/footer", label: "Components" },
] as const

export const foundationsNav: DocsNavItem[] = [
	{ href: "/foundations/colors", label: "Colors" },
	{ href: "/foundations/typography", label: "Typography" },
	{ href: "/foundations/spacing", label: "Spacing" },
	{ href: "/foundations/radius", label: "Radius" },
	{ href: "/foundations/motion", label: "Motion" },
] as const

export const componentNavGroups: DocsNavGroup[] = [
	{
		label: "Layout & structure",
		items: [
			{ href: "/components/card", label: "Card" },
			{ href: "/components/media-frame", label: "MediaFrame" },
			{ href: "/components/section-head", label: "SectionHead" },
			{ href: "/components/container", label: "Container" },
			{ href: "/components/action-rail", label: "ActionRail" },
		],
	},
	{
		label: "Navigation",
		items: [
			{ href: "/components/navbar", label: "Navbar" },
			{ href: "/components/footer", label: "Footer" },
			{ href: "/components/back-link", label: "BackLink" },
			{ href: "/components/rail", label: "Rail" },
			{ href: "/components/toc", label: "Toc" },
			{ href: "/components/command-search", label: "CommandSearch" },
		],
	},
	{
		label: "Forms & inputs",
		items: [
			{ href: "/components/button", label: "Button" },
			{ href: "/components/input", label: "Input" },
			{ href: "/components/select", label: "Select" },
			{ href: "/components/toggle", label: "Toggle" },
			{ href: "/components/segmented-control", label: "SegmentedControl" },
			{ href: "/components/theme-switcher", label: "ThemeSwitcher" },
			{ href: "/components/tag", label: "Tag" },
		],
	},
	{
		label: "Display",
		items: [
			{ href: "/components/badge", label: "Badge" },
			{ href: "/components/avatar", label: "Avatar" },
			{ href: "/components/status", label: "Status" },
			{ href: "/components/data-list", label: "DataList" },
			{ href: "/components/eyebrow", label: "Eyebrow" },
			{ href: "/components/metric", label: "Metric" },
			{ href: "/components/meta-row", label: "MetaRow" },
		],
	},
	{
		label: "Content",
		items: [
			{ href: "/components/pull-quote", label: "PullQuote" },
			{ href: "/components/callout", label: "Callout" },
			{ href: "/components/code-block", label: "CodeBlock" },
			{ href: "/components/link-list", label: "LinkList" },
			{ href: "/components/resources-panel", label: "ResourcesPanel" },
			{ href: "/components/testimonial", label: "Testimonial" },
			{ href: "/components/testimonial-grid", label: "TestimonialGrid" },
			{ href: "/components/editorial-line", label: "EditorialLine" },
		],
	},
	{
		label: "Feedback",
		items: [
			{ href: "/components/toast", label: "Toast", meta: "beta" },
			{ href: "/components/skeleton", label: "Skeleton" },
			{ href: "/components/progress", label: "Progress" },
		],
	},
] as const

export const docsPagerNav: DocsNavItem[] = [
	{ href: "/", label: "Introduction" },
	{ href: "/installation", label: "Installation" },
	{ href: "/foundations/colors", label: "Colors" },
	{ href: "/foundations/typography", label: "Typography" },
	{ href: "/foundations/spacing", label: "Spacing" },
	{ href: "/foundations/radius", label: "Radius" },
	{ href: "/foundations/motion", label: "Motion" },
	{ href: "/components/avatar", label: "Avatar" },
	{ href: "/components/button", label: "Button" },
	{ href: "/components/card", label: "Card" },
	{ href: "/components/container", label: "Container" },
	{ href: "/components/data-list", label: "DataList" },
	{ href: "/components/eyebrow", label: "Eyebrow" },
	{ href: "/components/link-list", label: "LinkList" },
	{ href: "/components/metric", label: "Metric" },
	{ href: "/components/navbar", label: "Navbar" },
	{ href: "/components/command-search", label: "CommandSearch" },
	{ href: "/components/progress", label: "Progress" },
	{ href: "/components/resources-panel", label: "ResourcesPanel" },
	{ href: "/components/select", label: "Select" },
	{ href: "/components/section-head", label: "SectionHead" },
	{ href: "/components/status", label: "Status" },
	{ href: "/components/tag", label: "Tag" },
	{ href: "/components/testimonial", label: "Testimonial" },
	{ href: "/components/testimonial-grid", label: "TestimonialGrid" },
	{ href: "/components/toggle", label: "Toggle" },
	{ href: "/components/segmented-control", label: "SegmentedControl" },
	{ href: "/components/theme-switcher", label: "ThemeSwitcher" },
	{ href: "/components/footer", label: "Footer" },
	{ href: "/components/action-rail", label: "ActionRail" },
	{ href: "/components/back-link", label: "BackLink" },
	{ href: "/components/badge", label: "Badge" },
	{ href: "/components/callout", label: "Callout" },
	{ href: "/components/code-block", label: "CodeBlock" },
	{ href: "/components/input", label: "Input" },
	{ href: "/components/pull-quote", label: "PullQuote" },
	{ href: "/components/rail", label: "Rail" },
	{ href: "/components/skeleton", label: "Skeleton" },
	{ href: "/components/toast", label: "Toast" },
	{ href: "/components/toc", label: "Toc" },
	{ href: "/components/editorial-line", label: "EditorialLine" },
	{ href: "/components/meta-row", label: "MetaRow" },
] as const
