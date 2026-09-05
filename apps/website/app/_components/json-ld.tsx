import type { Identity } from "../lib/identity"
import { siteUrl } from "../lib/seo"

interface Props<T> {
	data: T
}

interface BreadcrumbItem {
	name: string
	path: `/${string}`
}

interface PageJsonLdInput {
	title: string
	description: string
	path: `/${string}`
}

interface CollectionJsonLdInput extends PageJsonLdInput {
	items: ReadonlyArray<{ name: string; path: `/${string}` }>
}

const authorId = "https://chitrankagnihotri.com/#person"
const authorName = "Chitrank Agnihotri"
const authorUrl = "https://chitrankagnihotri.com"

function getArticleAuthorJsonLd() {
	return {
		"@type": "Person",
		"@id": authorId,
		name: authorName,
		url: authorUrl,
	}
}

function absoluteUrl(path: `/${string}`) {
	return new URL(path, `${siteUrl}/`).toString()
}

export function getPersonJsonLd(identity: Identity) {
	return {
		"@type": "Person",
		"@id": `${identity.websiteUrl}/#person`,
		name: identity.name,
		alternateName: identity.alternateNames,
		image: identity.portraitUrl,
		url: identity.websiteUrl,
		jobTitle: identity.jobTitle,
		worksFor: {
			"@type": "Organization",
			name: identity.company.name,
			url: identity.company.url,
		},
		alumniOf: {
			"@type": "CollegeOrUniversity",
			name: identity.education,
		},
		nationality: identity.nationality,
		knowsAbout: identity.knowsAbout,
		sameAs: [identity.socials.linkedin, identity.socials.github],
		mainEntityOfPage: {
			"@id": `${identity.websiteUrl}/#webpage`,
		},
	}
}

export function getWebsiteJsonLd(identity: Identity | null, siteUrl: string) {
	const jsonLd: Record<string, unknown> = {
		"@type": "WebSite",
		"@id": `${siteUrl}/#website`,
		url: siteUrl,
		name: "monoline/ui",
		description:
			"Documentation and interactive examples for the Monoline UI React component library.",
		about: {
			"@id": `${siteUrl}/#software-source-code`,
		},
	}

	if (identity) {
		jsonLd.publisher = {
			"@id": `${identity.websiteUrl}/#person`,
		}
	}

	return jsonLd
}

export function getSoftwareSourceCodeJsonLd(
	identity: Identity | null,
	siteUrl: string,
	version: string
) {
	const jsonLd: Record<string, unknown> = {
		"@type": "SoftwareSourceCode",
		"@id": `${siteUrl}/#software-source-code`,
		name: "Monoline UI",
		alternateName: "@chitrank2050/monoline-ui",
		description:
			"A monochrome-first React 19 component library for personal sites, portfolios, product interfaces, and developer documentation.",
		url: siteUrl,
		codeRepository: "https://github.com/chitranklabs/monoline-ui",
		programmingLanguage: ["TypeScript", "CSS"],
		runtimePlatform: "React 19",
		license: "https://github.com/chitranklabs/monoline-ui/blob/main/LICENSE",
		sameAs: [
			"https://github.com/chitranklabs/monoline-ui",
			"https://www.npmjs.com/package/@chitrank2050/monoline-ui",
			"https://jsr.io/@chitrank2050/monoline-ui",
		],
		downloadUrl: "https://www.npmjs.com/package/@chitrank2050/monoline-ui",
		softwareRequirements: "React 18.2 or React 19; Tailwind CSS v4",
		keywords: [
			"React component library",
			"React Server Components",
			"Tailwind CSS v4",
			"design tokens",
			"editorial UI",
		],
		version,
		isAccessibleForFree: true,
	}

	if (identity) {
		const person = { "@id": `${identity.websiteUrl}/#person` }
		jsonLd.author = person
		jsonLd.creator = person
		jsonLd.maintainer = person
	}

	return jsonLd
}

export function createBreadcrumbJsonLd(items: readonly BreadcrumbItem[]) {
	return {
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: absoluteUrl(item.path),
		})),
	}
}

export function createWebPageJsonLd({
	title,
	description,
	path,
}: PageJsonLdInput) {
	const url = absoluteUrl(path)

	return {
		"@type": "WebPage",
		"@id": `${url}#webpage`,
		url,
		name: title,
		description,
		inLanguage: "en",
		isPartOf: { "@id": `${siteUrl}/#website` },
		about: { "@id": `${siteUrl}/#software-source-code` },
	}
}

export function createTechArticleJsonLd(input: PageJsonLdInput) {
	const author = getArticleAuthorJsonLd()

	return {
		...createWebPageJsonLd(input),
		"@type": "TechArticle",
		headline: input.title,
		author,
		publisher: author,
	}
}

export function createCollectionPageJsonLd({
	title,
	description,
	path,
	items,
}: CollectionJsonLdInput) {
	return {
		...createWebPageJsonLd({ title, description, path }),
		"@type": "CollectionPage",
		mainEntity: {
			"@type": "ItemList",
			numberOfItems: items.length,
			itemListElement: items.map((item, index) => ({
				"@type": "ListItem",
				position: index + 1,
				name: item.name,
				url: absoluteUrl(item.path),
			})),
		},
	}
}

function serializeJsonLd<T>(data: T) {
	return JSON.stringify(data).replace(/[<\u2028\u2029]/g, (char) => {
		switch (char) {
			case "<":
				return "\\u003c"
			case "\u2028":
				return "\\u2028"
			case "\u2029":
				return "\\u2029"
			default:
				return char
		}
	})
}

export default function JsonLd<T>({ data }: Props<T>) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
		/>
	)
}
