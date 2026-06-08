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
			{ label: "Card" },
			{ label: "SectionHead" },
			{ label: "Container" },
			{ label: "ActionRail" },
		],
	},
	{
		label: "Navigation",
		items: [
			{ label: "Navbar" },
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
			{ href: "/components/toggle", label: "Toggle" },
			{ href: "/components/tag", label: "Tag" },
		],
	},
	{
		label: "Display",
		items: [
			{ label: "Badge" },
			{ label: "Avatar" },
			{ label: "Status" },
			{ label: "MetaRow" },
			{ label: "Eyebrow" },
			{ label: "Metric" },
		],
	},
	{
		label: "Content",
		items: [
			{ label: "PullQuote" },
			{ label: "Callout" },
			{ label: "CodeBlock" },
			{ label: "EditorialLine" },
			{ label: "Testimonial", meta: "beta" },
			{ label: "ResourcesPanel", meta: "beta" },
		],
	},
	{
		label: "Feedback",
		items: [
			{ label: "Toast", meta: "beta" },
			{ label: "Skeleton" },
			{ label: "Progress" },
		],
	},
] as const

export const docsPagerNav: DocsNavItem[] = [
	{ href: "/", label: "Introduction" },
	{ href: "/installation", label: "Installation" },
	{ href: "/foundations/colors", label: "Colors" },
	{ href: "/foundations/typography", label: "Typography" },
	{ href: "/foundations/spacing-motion", label: "Spacing & radius" },
	{ href: "/components/button", label: "Button" },
	{ href: "/components/tag", label: "Tag" },
	{ href: "/components/toggle", label: "Toggle" },
	{ href: "/components/footer", label: "Footer" },
] as const
