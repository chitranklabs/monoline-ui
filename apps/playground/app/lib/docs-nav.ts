export const foundationsNav = [
	{ href: "/foundations/colors", label: "Colors" },
	{ href: "/foundations/typography", label: "Typography" },
	{ href: "/foundations/spacing-motion", label: "Spacing & radius" },
	{ href: "/foundations/spacing-motion#motion", label: "Motion" },
] as const

export const componentNavGroups = [
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
			{ label: "Button" },
			{ label: "Input" },
			{ label: "Toggle" },
			{ label: "Tag" },
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
