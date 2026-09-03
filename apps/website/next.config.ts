import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	distDir: process.env.NEXT_DIST_DIR || ".next",
	trailingSlash: false,
	async redirects() {
		// Keep the existing public route migration independent of workspace paths.
		return [
			{
				source: "/installation",
				destination: "/docs/installation",
				permanent: true,
			},
			{
				source: "/accessibility",
				destination: "/docs/accessibility",
				permanent: true,
			},
			{
				source: "/theming",
				destination: "/docs/theming",
				permanent: true,
			},
			{
				source: "/compatibility",
				destination: "/docs/compatibility",
				permanent: true,
			},
			{
				source: "/patterns",
				destination: "/docs/patterns",
				permanent: true,
			},
			{
				source: "/changelog",
				destination: "/docs/changelog",
				permanent: true,
			},
			{
				source: "/foundations",
				destination: "/docs/foundations",
				permanent: true,
			},
			{
				source: "/foundations/spacing-motion",
				destination: "/docs/foundations/spacing",
				permanent: true,
			},
			{
				source: "/foundations/:slug",
				destination: "/docs/foundations/:slug",
				permanent: true,
			},
			{
				source: "/components",
				destination: "/docs/components",
				permanent: true,
			},
			{
				source: "/components/:slug",
				destination: "/docs/components/:slug",
				permanent: true,
			},
		]
	},
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
					{ key: "Cross-Origin-Opener-Policy", value: "same-origin" },
				],
			},
		]
	},
	transpilePackages: [],
	reactCompiler: true,
	poweredByHeader: false,
	compress: true,
	experimental: {
		webpackMemoryOptimizations: true,
		optimizePackageImports: [
			"@radix-ui/react-slot",
			"cmdk",
			"prismjs",
			"@vercel/analytics",
			"clsx",
			"tailwind-merge",
		],
	},
}

export default nextConfig
