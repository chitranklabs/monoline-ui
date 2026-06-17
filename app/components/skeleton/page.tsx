import type { Metadata } from "next"

import SkeletonPageClient from "./client-page"

export const metadata: Metadata = {
	title: "Skeleton Component - monoline/ui reference",
	description:
		"API reference and variants for the monoline/ui Skeleton component, including rect, pill, and circle variations.",
	alternates: {
		canonical: "/components/skeleton",
	},
}

export default function SkeletonPage() {
	return <SkeletonPageClient />
}
