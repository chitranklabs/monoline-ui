import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import SkeletonPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Skeleton React Loading Placeholder | monoline/ui Docs",
	description:
		"Learn how to use the monoline/ui Skeleton React component to reserve loading space with rectangle, pill, circle, and text placeholder variants for stable UI.",
	path: "/components/skeleton",
})

export default function SkeletonPage() {
	return <SkeletonPageClient />
}
