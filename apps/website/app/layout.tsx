import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

import { ScrollToTop } from "./_components/scroll-to-top"
import { SiteFooter } from "./_components/site-footer"
import { SiteHeader } from "./_components/site-header"
import { ThemeProvider } from "./_components/theme-provider"
import "./globals.css"
import { monolineFontClassName } from "./lib/fonts"
import { fetchIdentity } from "./lib/identity"
import { siteUrl } from "./lib/seo"

export async function generateMetadata(): Promise<Metadata> {
	const identity = await fetchIdentity()
	const author = identity
		? { name: identity.name, url: identity.websiteUrl }
		: { name: "monoline/ui", url: siteUrl }

	return {
		metadataBase: new URL(siteUrl),
		authors: [author],
		creator: author.name,
		publisher: author.name,
		appleWebApp: {
			capable: true,
			title: "monoline/ui",
			statusBarStyle: "black-translucent",
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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === "production"

	return (
		<html
			lang="en"
			data-theme="light"
			className={monolineFontClassName}
			suppressHydrationWarning
			data-scroll-behavior="smooth"
		>
			<body suppressHydrationWarning data-scroll-behavior="smooth">
				<script
					id="monoline-theme-init"
					dangerouslySetInnerHTML={{
						__html: `(function(){try{var t=localStorage.getItem('ml-theme');var d=document.documentElement;if(t==='light'||t==='dark'){d.setAttribute('data-theme',t);return;}if(window.matchMedia('(prefers-color-scheme: dark)').matches){d.setAttribute('data-theme','dark');return;}d.setAttribute('data-theme','light');}catch(e){}})();`,
					}}
				/>
				<ThemeProvider>
					<ScrollToTop />
					<div className="min-h-screen bg-background">
						<a className="skip-link" href="#main-content">
							Skip to content
						</a>
						<SiteHeader />
						{children}
						<SiteFooter />
					</div>
				</ThemeProvider>
				{isProduction && <Analytics />}
				{isProduction && <SpeedInsights />}
			</body>
		</html>
	)
}
