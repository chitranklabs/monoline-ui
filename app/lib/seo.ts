export const siteUrl =
	process.env.NEXT_PUBLIC_SITE_URL ?? "https://monolineui.chitrankagnihotri.com"

export const siteRoutes = [
	"/",
	"/installation",
	"/foundations/colors",
	"/foundations/typography",
	"/foundations/spacing-motion",
	"/components/back-link",
	"/components/container",
	"/components/footer",
] as const
