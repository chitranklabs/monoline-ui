import type { Identity } from "../lib/identity"

interface Props<T> {
	data: T
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
	}

	if (identity) {
		jsonLd.publisher = {
			"@id": `${identity.websiteUrl}/#person`,
		}
	}

	return jsonLd
}

export function getWebpageJsonLd(identity: Identity | null, siteUrl: string) {
	const jsonLd: Record<string, unknown> = {
		"@type": "WebPage",
		"@id": `${siteUrl}/#webpage`,
		url: siteUrl,
		name: "monoline/ui  Component library for personal sites & developer docs",
		isPartOf: {
			"@id": `${siteUrl}/#website`,
		},
	}

	if (identity) {
		jsonLd.about = {
			"@id": `${identity.websiteUrl}/#person`,
		}
	}

	return jsonLd
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
