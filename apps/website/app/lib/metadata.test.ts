import { describe, expect, it } from "vitest"

import { createPageMetadata, socialImage } from "./metadata"

describe("createPageMetadata", () => {
	it("keeps canonical and social metadata aligned to the public URL", () => {
		const metadata = createPageMetadata({
			title: "Button React Component Documentation | Monoline UI",
			description:
				"Build accessible React buttons with primary, secondary, ghost, icon, loading, and link variants. Review live examples, API details, tokens, and source code.",
			path: "/docs/components/button",
		})

		expect(metadata.alternates?.canonical).toBe("/docs/components/button")
		expect(metadata.openGraph?.url).toBe(
			"https://monolineui.chitrankagnihotri.com/docs/components/button"
		)
		expect(metadata.openGraph?.images).toEqual([socialImage])
		expect(metadata.twitter?.images).toEqual([socialImage])
	})
})
