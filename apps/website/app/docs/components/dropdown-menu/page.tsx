import type { Metadata } from "next"

import { createPageMetadata } from "../../../lib/metadata"
import { componentPath } from "../../../lib/routes"
import DropdownMenuPageClient from "./client-page"

export const metadata: Metadata = createPageMetadata({
	title: "Accessible React Dropdown Menu Component | monoline/ui",
	description:
		"Group secondary React actions in an accessible dropdown menu with roving focus, typeahead, disabled items, checkboxes, radio choices, submenus, and portals.",
	path: componentPath("dropdown-menu"),
})

export default function DropdownMenuPage() {
	return <DropdownMenuPageClient />
}
