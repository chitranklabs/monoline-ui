export interface Identity {
	name: string
	alternateNames: string[]
	title: string
	description: string
	keywords: string[]
	websiteUrl: string
	portraitUrl: string
	jobTitle: string
	company: {
		name: string
		url: string
	}
	education: string
	nationality: string
	knowsAbout: string[]
	socials: {
		linkedin: string
		github: string
	}
}

const identityUrl = "https://chitrankagnihotri.com/identity.json"
const identityRevalidateSeconds = 86400
const identityFetchTimeoutMs = 3000

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null
}

function isStringArray(value: unknown): value is string[] {
	return Array.isArray(value) && value.every((item) => typeof item === "string")
}

function isIdentity(value: unknown): value is Identity {
	if (!isRecord(value)) return false

	const company = value.company
	const socials = value.socials

	return (
		typeof value.name === "string" &&
		isStringArray(value.alternateNames) &&
		typeof value.title === "string" &&
		typeof value.description === "string" &&
		isStringArray(value.keywords) &&
		typeof value.websiteUrl === "string" &&
		typeof value.portraitUrl === "string" &&
		typeof value.jobTitle === "string" &&
		isRecord(company) &&
		typeof company.name === "string" &&
		typeof company.url === "string" &&
		typeof value.education === "string" &&
		typeof value.nationality === "string" &&
		isStringArray(value.knowsAbout) &&
		isRecord(socials) &&
		typeof socials.linkedin === "string" &&
		typeof socials.github === "string"
	)
}

export async function fetchIdentity(): Promise<Identity | null> {
	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), identityFetchTimeoutMs)

	try {
		const res = await fetch(identityUrl, {
			next: { revalidate: identityRevalidateSeconds },
			signal: controller.signal,
		})

		if (!res.ok) return null

		const identity = await res.json()
		return isIdentity(identity) ? identity : null
	} catch {
		return null
	} finally {
		clearTimeout(timeoutId)
	}
}
