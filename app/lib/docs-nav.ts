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
	{ href: "/foundations/spacing-motion", label: "Spacing & radius" },
	{ href: "/foundations/spacing-motion#motion", label: "Motion" },
] as const

export const componentNavGroups: DocsNavGroup[] = [
	{
		label: "Layout & structure",
		items: [
			{ href: "/components/card", label: "Card" },
			{ href: "/components/media-frame", label: "MediaFrame" },
			{ href: "/components/section-head", label: "SectionHead" },
			{ label: "Container" },
			{ label: "ActionRail" },
		],
	},
	{
		label: "Navigation",
		items: [
			{ href: "/components/navbar", label: "Navbar" },
			{ href: "/components/footer", label: "Footer" },
			{ label: "Rail" },
			{ label: "Toc" },
		],
	},
	{
		label: "Forms & inputs",
		items: [
			{ href: "/components/button", label: "Button" },
			{ label: "Input" },
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
			{ label: "Badge" },
			{ href: "/components/avatar", label: "Avatar" },
			{ href: "/components/status", label: "Status" },
			{ href: "/components/data-list", label: "DataList" },
			{ href: "/components/eyebrow", label: "Eyebrow" },
			{ href: "/components/metric", label: "Metric" },
		],
	},
	{
		label: "Content",
		items: [
			{ label: "PullQuote" },
			{ label: "Callout" },
			{ label: "CodeBlock" },
			{ label: "EditorialLine" },
			{ href: "/components/testimonial", label: "Testimonial" },
			{ href: "/components/testimonial-grid", label: "TestimonialGrid" },
			{ label: "ResourcesPanel", meta: "beta" },
		],
	},
	{
		label: "Feedback",
		items: [
			{ label: "Toast", meta: "beta" },
			{ label: "Skeleton" },
			{ href: "/components/progress", label: "Progress" },
		],
	},
] as const

export const docsPagerNav: DocsNavItem[] = [
	{ href: "/", label: "Introduction" },
	{ href: "/installation", label: "Installation" },
	{ href: "/foundations/colors", label: "Colors" },
	{ href: "/foundations/typography", label: "Typography" },
	{ href: "/foundations/spacing-motion", label: "Spacing & radius" },
	{ href: "/components/avatar", label: "Avatar" },
	{ href: "/components/button", label: "Button" },
	{ href: "/components/card", label: "Card" },
	{ href: "/components/data-list", label: "DataList" },
	{ href: "/components/eyebrow", label: "Eyebrow" },
	{ href: "/components/media-frame", label: "MediaFrame" },
	{ href: "/components/metric", label: "Metric" },
	{ href: "/components/navbar", label: "Navbar" },
	{ href: "/components/progress", label: "Progress" },
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
] as const
