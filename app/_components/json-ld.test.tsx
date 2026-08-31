import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import JsonLd, {
	createBreadcrumbJsonLd,
	createCollectionPageJsonLd,
	createTechArticleJsonLd,
	getPersonJsonLd,
	getSoftwareSourceCodeJsonLd,
} from "./json-ld"

const identity = {
	name: "Chitrank Agnihotri",
	alternateNames: ["Chitrank"],
	title: "Senior Technical Lead",
	description: "Software engineer",
	keywords: ["React"],
	websiteUrl: "https://chitrankagnihotri.com",
	portraitUrl: "https://chitrankagnihotri.com/portrait.png",
	jobTitle: "Senior Technical Lead",
	company: {
		name: "Humanform.ai",
		url: "https://humanform.ai",
	},
	education: "Bhagwan Parshuram Institute of Technology",
	nationality: "Indian",
	knowsAbout: ["React"],
	socials: {
		linkedin: "https://www.linkedin.com/in/chitrank-agnihotri/",
		github: "https://github.com/chitrank2050",
	},
}

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

	it("links the Person entity to the canonical employer", () => {
		expect(getPersonJsonLd(identity).worksFor).toEqual({
			"@type": "Organization",
			name: "Humanform.ai",
			url: "https://humanform.ai",
		})
	})

	it("creates canonical TechArticle and breadcrumb entities", () => {
		const article = createTechArticleJsonLd({
			title: "Button React component",
			description: "Typed button integration guidance.",
			path: "/docs/components/button",
		})
		const breadcrumbs = createBreadcrumbJsonLd([
			{ name: "Monoline UI", path: "/" },
			{ name: "Button", path: "/docs/components/button" },
		])

		expect(article).toMatchObject({
			"@type": "TechArticle",
			"@id":
				"https://monolineui.chitrankagnihotri.com/docs/components/button#webpage",
			url: "https://monolineui.chitrankagnihotri.com/docs/components/button",
			author: {
				"@type": "Person",
				"@id": "https://chitrankagnihotri.com/#person",
				name: "Chitrank Agnihotri",
				url: "https://chitrankagnihotri.com",
			},
			publisher: {
				"@type": "Person",
				"@id": "https://chitrankagnihotri.com/#person",
				name: "Chitrank Agnihotri",
				url: "https://chitrankagnihotri.com",
			},
		})
		expect(breadcrumbs.itemListElement).toHaveLength(2)
		expect(breadcrumbs.itemListElement[1]).toMatchObject({
			position: 2,
			item: "https://monolineui.chitrankagnihotri.com/docs/components/button",
		})
	})

	it("describes hub pages as complete item collections", () => {
		const collection = createCollectionPageJsonLd({
			title: "React component catalog",
			description: "All documented components.",
			path: "/docs/components",
			items: [
				{ name: "Button", path: "/docs/components/button" },
				{ name: "Card", path: "/docs/components/card" },
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
