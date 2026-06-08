import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	transpilePackages: ["@chitrank2050/monoline-ui"],
	experimental: {
		optimizePackageImports: ["@chitrank2050/monoline-ui"],
	},
}

export default nextConfig
