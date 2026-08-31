export const componentSlugs = [
	"action-rail",
	"avatar",
	"back-link",
	"badge",
	"button",
	"callout",
	"card",
	"changelog",
	"checkbox",
	"code-block",
	"command-search",
	"container",
	"data-list",
	"dialog",
	"dropdown-menu",
	"editorial-line",
	"eyebrow",
	"field",
	"footer",
	"input",
	"label",
	"link-list",
	"media-frame",
	"meta-row",
	"metric",
	"navbar",
	"popover",
	"progress",
	"pull-quote",
	"radio-group",
	"rail",
	"resources-panel",
	"section-head",
	"segmented-control",
	"select",
	"separator",
	"skeleton",
	"status",
	"tag",
	"testimonial",
	"testimonial-grid",
	"textarea",
	"theme-switcher",
	"toast",
	"toc",
	"toggle",
	"tooltip",
] as const

export type ComponentSlug = (typeof componentSlugs)[number]
export type SitePath = `/${string}`

export function componentPath(slug: ComponentSlug): SitePath {
	return `/docs/components/${slug}`
}

export const routes = {
	home: "/",
	docs: {
		root: "/docs",
		installation: "/docs/installation",
		accessibility: "/docs/accessibility",
		theming: "/docs/theming",
		compatibility: "/docs/compatibility",
		patterns: "/docs/patterns",
		foundations: {
			root: "/docs/foundations",
			colors: "/docs/foundations/colors",
			typography: "/docs/foundations/typography",
			spacing: "/docs/foundations/spacing",
			radius: "/docs/foundations/radius",
			motion: "/docs/foundations/motion",
		},
		components: {
			root: "/docs/components",
			item: componentPath,
		},
		changelog: "/docs/changelog",
	},
	changelog: "/docs/changelog",
} as const

export const siteRoutes: readonly SitePath[] = [
	routes.home,
	routes.docs.root,
	routes.docs.installation,
	routes.docs.accessibility,
	routes.docs.theming,
	routes.docs.compatibility,
	routes.docs.patterns,
	routes.docs.foundations.root,
	routes.docs.foundations.colors,
	routes.docs.foundations.typography,
	routes.docs.foundations.spacing,
	routes.docs.foundations.radius,
	routes.docs.foundations.motion,
	routes.docs.components.root,
	...componentSlugs.map(componentPath),
	routes.docs.changelog,
]

interface LegacyRedirect {
	source: SitePath
	destination: SitePath
	permanent: true
}

const movedDocsRoutes: readonly [SitePath, SitePath][] = [
	["/installation", routes.docs.installation],
	["/accessibility", routes.docs.accessibility],
	["/theming", routes.docs.theming],
	["/compatibility", routes.docs.compatibility],
	["/patterns", routes.docs.patterns],
	["/changelog", routes.docs.changelog],
	["/foundations", routes.docs.foundations.root],
	["/foundations/colors", routes.docs.foundations.colors],
	["/foundations/typography", routes.docs.foundations.typography],
	["/foundations/spacing", routes.docs.foundations.spacing],
	["/foundations/spacing-motion", routes.docs.foundations.spacing],
	["/foundations/radius", routes.docs.foundations.radius],
	["/foundations/motion", routes.docs.foundations.motion],
	["/components", routes.docs.components.root],
]

export const legacyRedirects: readonly LegacyRedirect[] = [
	...movedDocsRoutes.map(([source, destination]) => ({
		source,
		destination,
		permanent: true as const,
	})),
	...componentSlugs.map((slug) => ({
		source: `/components/${slug}` as SitePath,
		destination: componentPath(slug),
		permanent: true as const,
	})),
]
