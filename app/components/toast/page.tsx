import { createPageMetadata } from "../../lib/metadata"
import ToastPageClient from "./client-page"

export const metadata = createPageMetadata({
	title: "Toast Component - monoline/ui reference",
	description:
		"API reference and variants for the monoline/ui Toast component, including warning, success, and accent styles.",
	path: "/components/toast",
})

export default function ToastPage() {
	return <ToastPageClient />
}
