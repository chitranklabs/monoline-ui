import type { Metadata } from "next"

import { siteUrl } from "./seo"

export const socialImage = {
	url: new URL("/monoline-ui-og.jpg", `${siteUrl}/`).toString(),
	width: 1280,
	height: 640,
	alt: "Monoline UI monochrome React component library",
} as const

interface PageMetadataInput {
	title: string
	description: string
	path: `/${string}`
}

function absoluteUrl(path: `/${string}`) {
	return new URL(path, siteUrl).toString()
}

export function createPageMetadata({
	title,
	description,
	path,
}: PageMetadataInput): Metadata {
	const url = absoluteUrl(path)

	return {
		title,
		description,
		openGraph: {
			type: "website",
			url,
			siteName: "monoline/ui",
			title,
			description,
			images: [socialImage],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [socialImage],
		},
		alternates: {
			canonical: path,
		},
	}
}
