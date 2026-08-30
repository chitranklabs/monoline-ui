import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Monoline UI React Component Documentation",
		short_name: "monoline/ui",
		description:
			"Documentation and interactive examples for the Monoline UI React component library.",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#111111",
		icons: [
			{
				src: "/icon.png",
				sizes: "460x460",
				type: "image/png",
			},
		],
	}
}
