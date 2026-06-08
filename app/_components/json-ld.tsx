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

export function getWebsiteJsonLd(identity: Identity, siteUrl: string) {
	return {
		"@type": "WebSite",
		"@id": `${siteUrl}/#website`,
		url: siteUrl,
		name: "monoline/ui",
		publisher: {
			"@id": `${identity.websiteUrl}/#person`,
		},
	}
}

export function getWebpageJsonLd(identity: Identity, siteUrl: string) {
	return {
		"@type": "WebPage",
		"@id": `${siteUrl}/#webpage`,
		url: siteUrl,
		name: "monoline/ui  Component library for personal sites & developer docs",
		isPartOf: {
			"@id": `${siteUrl}/#website`,
		},
		about: {
			"@id": `${identity.websiteUrl}/#person`,
		},
	}
}

export default function JsonLd<T>({ data }: Props<T>) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	)
}
