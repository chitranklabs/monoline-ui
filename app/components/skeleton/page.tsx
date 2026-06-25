import type { Metadata } from "next"

import { createPageMetadata } from "../../lib/metadata"
import SkeletonPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Skeleton - monoline/ui component",
	description:
		"Reserve loading space with rectangle, pill, circle, and text placeholder variants.",
	path: "/components/skeleton",
})

export default function SkeletonPage() {
	return <SkeletonPageClient />
}
