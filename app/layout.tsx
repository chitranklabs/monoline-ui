import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"

import JsonLd, {
	getPersonJsonLd,
	getWebpageJsonLd,
	getWebsiteJsonLd,
} from "./_components/json-ld"
import { SiteFooter } from "./_components/site-footer"
import { SiteHeader } from "./_components/site-header"
import { ThemeProvider } from "./_components/theme-provider"
import "./globals.css"
import { monolineFontClassName } from "./lib/fonts"
import { fetchIdentity } from "./lib/identity"
import { siteUrl } from "./lib/seo"

export async function generateMetadata(): Promise<Metadata> {
	const identity = await fetchIdentity()
	return {
		metadataBase: new URL(siteUrl),
		title:
			"monoline/ui — Component library for personal sites & developer docs",
		description:
			"A Next.js docs and playground site for the Monoline UI component library.",
		authors: [{ name: identity.name, url: identity.websiteUrl }],
		creator: identity.name,
		publisher: identity.name,
		appleWebApp: {
			capable: true,
			title: "monoline/ui",
			statusBarStyle: "black-translucent",
		},
		openGraph: {
			type: "website",
			url: siteUrl,
			title:
				"monoline/ui — Component library for personal sites & developer docs",
			description:
				"A Next.js docs and playground site for the Monoline UI component library.",
			siteName: "monoline/ui",
		},
		twitter: {
			card: "summary_large_image",
			title:
				"monoline/ui — Component library for personal sites & developer docs",
			description:
				"A Next.js docs and playground site for the Monoline UI component library.",
		},
		alternates: {
			canonical: "/",
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
	}
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === "production"

	const identity = await fetchIdentity()

	const personJsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			getPersonJsonLd(identity),
			getWebsiteJsonLd(identity, siteUrl),
			getWebpageJsonLd(identity, siteUrl),
		],
	}

	return (
		<html
			lang="en"
			data-theme="light"
			className={monolineFontClassName}
			suppressHydrationWarning
		>
			<body>
				<script
					id="monoline-theme-init"
					dangerouslySetInnerHTML={{
						__html: `(function(){try{var t=localStorage.getItem('ml-theme');var d=document.documentElement;if(t==='light'||t==='dark'){d.setAttribute('data-theme',t);return;}if(window.matchMedia('(prefers-color-scheme: dark)').matches){d.setAttribute('data-theme','dark');return;}d.setAttribute('data-theme','light');}catch(e){}})();`,
					}}
				/>
				<JsonLd data={personJsonLd} />
				<ThemeProvider>
					<main className="min-h-screen bg-background">
						<SiteHeader />
						{children}
						<SiteFooter />
					</main>
				</ThemeProvider>
				{isProduction && <Analytics />}
			</body>
		</html>
	)
}
