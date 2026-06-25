import { createPageMetadata } from "../../lib/metadata"
import SkeletonPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "Skeleton Component - monoline/ui reference",
	description:
		"API reference and variants for the monoline/ui Skeleton component, including rect, pill, and circle variations.",
	path: "/components/skeleton",
})

export default function SkeletonPage() {
	return <SkeletonPageClient />
}
