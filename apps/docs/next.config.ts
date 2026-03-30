import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	transpilePackages: ["@foundry/tokens", "@foundry/ui"],
}

export default nextConfig
