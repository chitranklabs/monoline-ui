import type { MetadataRoute } from "next"

import { siteRoutes, siteUrl } from "./lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
	return siteRoutes.map((route) => ({
		url: new URL(route, `${siteUrl}/`).toString(),
	}))
}
