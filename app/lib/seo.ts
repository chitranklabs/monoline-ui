import metadataJson from "../../src/metadata.json"

export const siteUrl = "https://monolineui.chitrankagnihotri.com"

export const siteRoutes: readonly `/${string}`[] = [
	"/",
	"/docs",
	"/docs/installation",
	"/docs/accessibility",
	"/docs/theming",
	"/docs/compatibility",
	"/docs/patterns",
	"/docs/foundations",
	"/docs/foundations/colors",
	"/docs/foundations/typography",
	"/docs/foundations/spacing",
	"/docs/foundations/radius",
	"/docs/foundations/motion",
	"/docs/components",
	...metadataJson.components.map(
		(component) => `/docs/components/${component}` as const
	),
	"/changelog",
]
