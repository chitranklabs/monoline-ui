import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	trailingSlash: false,
	transpilePackages: ["@chitrank2050/monoline-ui"],
	reactCompiler: true,
	poweredByHeader: false,
	compress: true,
	experimental: {
		optimizePackageImports: [
			"@chitrank2050/monoline-ui",
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
