import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	distDir: process.env.NEXT_DIST_DIR || ".next",
	trailingSlash: false,
	async redirects() {
		return [
			{
				source: "/foundations/spacing-motion",
				destination: "/docs/foundations/spacing",
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
