const fallbackSiteUrl = "http://localhost:3001"

export const siteConfig = {
	name: "Monoline UI",
	description:
		"A modular design system and UI blueprint built from Chitrank's portfolio language.",
	url:
		process.env.NEXT_PUBLIC_SITE_URL ||
		(process.env.VERCEL_PROJECT_PRODUCTION_URL
			? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
			: fallbackSiteUrl),
} as const
