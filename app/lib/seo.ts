import metadataJson from "../../src/metadata.json"

export const siteUrl = "https://monolineui.chitrankagnihotri.com"

export const siteRoutes: readonly `/${string}`[] = [
	"/",
	"/installation",
	"/foundations",
	"/foundations/colors",
	"/foundations/typography",
	"/foundations/spacing",
	"/foundations/radius",
	"/foundations/motion",
	"/components",
	...metadataJson.components.map(
		(component) => `/components/${component}` as const
	),
	"/changelog",
]
