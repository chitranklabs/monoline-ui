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

export async function fetchIdentity(): Promise<Identity> {
	const res = await fetch("https://chitrankagnihotri.com/identity.json", {
		next: { revalidate: 86400 }, // Cache in Next.js for 24h
	})
	if (!res.ok) {
		throw new Error("Failed to fetch personal identity")
	}
	return res.json()
}
