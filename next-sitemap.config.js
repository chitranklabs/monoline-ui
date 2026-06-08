const siteUrl =
	process.env.NEXT_PUBLIC_SITE_URL || "https://monolineui.chitrankagnihotri.com"

/** @type {import('next-sitemap').IConfig} */
const config = {
	siteUrl,
	generateRobotsTxt: true,
	sitemapSize: 7000,
	outDir: "public",
	robotsTxtOptions: {
		policies: [
			{
				userAgent: "*",
				allow: "/",
			},
			{
				userAgent: "Googlebot",
				allow: "/",
			},
		],
		transformRobotsTxt: async (_config, robotsTxt) => {
			const cleaned = robotsTxt.replace(/# Host\nHost: .*\n/, "").trim()
			return `# ==================================================
#  monoline/ui
#  ${siteUrl}
#
#  Public docs and component playground.
#
#  -----
#  Built by Chitrank Agnihotri
#  Software Engineer
#  https://chitrankagnihotri.com
#  -----
#
# ==================================================

${cleaned}
`
		},
	},
}

export default config
