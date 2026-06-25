import type { Metadata } from "next"

import { siteUrl } from "./seo"

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
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
		},
		alternates: {
			canonical: path,
		},
	}
}
