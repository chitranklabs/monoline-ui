import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import JsonLd, {
	createBreadcrumbJsonLd,
	createCollectionPageJsonLd,
	createTechArticleJsonLd,
	getSoftwareSourceCodeJsonLd,
} from "./json-ld"

describe("JsonLd", () => {
	it("escapes script-breaking characters in structured data", () => {
		const { container } = render(
			<JsonLd data={{ name: "</script><script>alert(1)</script>" }} />
		)

		const script = container.querySelector('script[type="application/ld+json"]')

		expect(script).not.toBeNull()
		expect(script?.innerHTML).toContain("\\u003c/script>")
		expect(script?.innerHTML).not.toContain("</script>")
	})

	it("describes the package as source code with verifiable links", () => {
		const jsonLd = getSoftwareSourceCodeJsonLd(
			null,
			"https://monolineui.chitrankagnihotri.com",
			"0.2.3"
		)

		expect(jsonLd).toMatchObject({
			"@type": "SoftwareSourceCode",
			"@id": "https://monolineui.chitrankagnihotri.com/#software-source-code",
			name: "Monoline UI",
			codeRepository: "https://github.com/chitranklabs/monoline-ui",
			programmingLanguage: ["TypeScript", "CSS"],
			runtimePlatform: "React 19",
			license: "https://github.com/chitranklabs/monoline-ui/blob/main/LICENSE",
			version: "0.2.3",
			isAccessibleForFree: true,
			sameAs: [
				"https://github.com/chitranklabs/monoline-ui",
				"https://www.npmjs.com/package/@chitrank2050/monoline-ui",
				"https://jsr.io/@chitrank2050/monoline-ui",
			],
		})
	})

	it("creates canonical TechArticle and breadcrumb entities", () => {
		const article = createTechArticleJsonLd({
			title: "Button React component",
			description: "Typed button integration guidance.",
			path: "/components/button",
		})
		const breadcrumbs = createBreadcrumbJsonLd([
			{ name: "Monoline UI", path: "/" },
			{ name: "Button", path: "/components/button" },
		])

		expect(article).toMatchObject({
			"@type": "TechArticle",
			"@id":
				"https://monolineui.chitrankagnihotri.com/components/button#webpage",
			url: "https://monolineui.chitrankagnihotri.com/components/button",
			author: { "@id": "https://chitrankagnihotri.com/#person" },
		})
		expect(breadcrumbs.itemListElement).toHaveLength(2)
		expect(breadcrumbs.itemListElement[1]).toMatchObject({
			position: 2,
			item: "https://monolineui.chitrankagnihotri.com/components/button",
		})
	})

	it("describes hub pages as complete item collections", () => {
		const collection = createCollectionPageJsonLd({
			title: "React component catalog",
			description: "All documented components.",
			path: "/components",
			items: [
				{ name: "Button", path: "/components/button" },
				{ name: "Card", path: "/components/card" },
			],
		})

		expect(collection).toMatchObject({
			"@type": "CollectionPage",
			mainEntity: {
				"@type": "ItemList",
				numberOfItems: 2,
			},
		})
	})
})
