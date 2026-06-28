import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	trailingSlash: false,
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
