export const accentThemes = [
	{
		id: "copper",
		label: "Copper",
		description:
			"Warm and editorial. Great for portfolio storytelling and premium product surfaces.",
		swatches: ["#b86f52", "#dd9b7c", "#f3d7ca"],
	},
	{
		id: "ocean",
		label: "Ocean",
		description:
			"Cool and technical. Useful for dashboards, SaaS products, and modern interfaces.",
		swatches: ["#0f7ea8", "#6bc2de", "#d6f1f8"],
	},
	{
		id: "moss",
		label: "Moss",
		description:
			"Grounded and calm. A softer direction for thoughtful, systems-heavy experiences.",
		swatches: ["#5f7f57", "#9ec59a", "#e0eedf"],
	},
] as const

export const foundationGroups = [
	{
		title: "Color tokens",
		items: [
			"Semantic variables for surface, content, borders, states, and accents.",
			"Light and dark modes share the same system vocabulary.",
			"Accent palettes can change brand mood without rewriting components.",
		],
	},
	{
		title: "Type system",
		items: [
			"Sans for readability, mono for structure, script for signature moments.",
			"Headline and supporting scales are documented together.",
			"Components inherit typography instead of redefining it each time.",
		],
	},
	{
		title: "Spatial rules",
		items: [
			"Spacing tokens are tuned for cards, sections, forms, and dense layouts.",
			"Radius and shadow tokens create consistency across all surface types.",
			"Motion is subtle and intentional rather than decorative noise.",
		],
	},
] as const

export const typographyScale = [
	{
		label: "Display / Mono",
		token: "--type-display",
		className: "font-mono text-4xl sm:text-5xl font-semibold tracking-tight",
		preview: "Structured headline",
	},
	{
		label: "Signature / Script",
		token: "--type-signature",
		className: "font-script text-3xl text-primary",
		preview: "Human touch",
	},
	{
		label: "Body / Sans",
		token: "--type-body",
		className: "font-sans text-base text-muted-foreground",
		preview: "Readable interface copy",
	},
] as const

export const spacingScale = [
	{ token: "2", rem: "0.5rem", preview: "2rem" },
	{ token: "4", rem: "1rem", preview: "4rem" },
	{ token: "6", rem: "1.5rem", preview: "6rem" },
	{ token: "8", rem: "2rem", preview: "8rem" },
	{ token: "12", rem: "3rem", preview: "12rem" },
	{ token: "16", rem: "4rem", preview: "16rem" },
] as const
