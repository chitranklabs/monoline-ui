import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@chitrank2050/monoline-ui/button"
import { Container } from "@chitrank2050/monoline-ui/container"
import metadataJson from "@chitrank2050/monoline-ui/metadata.json"
import { SectionHead } from "@chitrank2050/monoline-ui/section-head"
import { Status } from "@chitrank2050/monoline-ui/status"

import pkg from "../package.json"
import { HomeArchitectureTabs } from "./_components/home-architecture-tabs"
import { HomeComponentGallery } from "./_components/home-component-gallery"
import { HomeHeroGrid } from "./_components/home-hero-grid"
import { HomeQuickInstall } from "./_components/home-quick-install"
import JsonLd, {
	createWebPageJsonLd,
	getPersonJsonLd,
	getSoftwareSourceCodeJsonLd,
	getWebsiteJsonLd,
} from "./_components/json-ld"
import { fetchIdentity } from "./lib/identity"
import { createPageMetadata } from "./lib/metadata"
import { getLatestRelease } from "./lib/releases"
import { siteUrl } from "./lib/seo"

const homeTitle = "React Component Library for Editorial UI | monoline/ui"
const homeDescription =
	"Build responsive React interfaces with monoline/ui, a token-first component library for portfolios, documentation, and editorial products using Tailwind CSS v4."

export const metadata: Metadata = createPageMetadata({
	title: homeTitle,
	description: homeDescription,
	path: "/",
})

const stats = [
	{ value: `${metadataJson.count}`, label: "Components" },
	{ value: "0 ms", label: "Runtime CSS" },
	{ value: "2", label: "Native Themes" },
	{ value: "100%", label: "TypeScript" },
	{ value: "MIT", label: "Open Source" },
]

export default async function HomePage() {
	const [release, identity] = await Promise.all([
		getLatestRelease(),
		fetchIdentity(),
	])

	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			identity ? getPersonJsonLd(identity) : null,
			getWebsiteJsonLd(identity, siteUrl),
			getSoftwareSourceCodeJsonLd(identity, siteUrl, pkg.version),
			createWebPageJsonLd({
				title: homeTitle,
				description: homeDescription,
				path: "/",
			}),
		].filter(Boolean),
	}

	return (
		<Container
			as="main"
			id="main-content"
			tabIndex={-1}
			className="intro-page pt-ml-14 pb-ml-6"
		>
			<JsonLd data={jsonLd} />

			{/* HERO SECTION */}
			<section className="flex flex-col items-start gap-ml-8">
				<div className="flex flex-col items-start gap-ml-4">
					<Link
						href="/changelog"
						className="group inline-flex items-center gap-2 border border-border rounded-full bg-surface-2/60 py-1 pl-1.5 pr-3 text-xs text-text-secondary no-underline transition-colors hover:border-border-strong hover:text-text"
					>
						<Status variant="accent" size="sm" animate>
							{release.version}
						</Status>
						<span className="font-mono text-3xs font-semibold uppercase tracking-eyebrow">
							Tailwind v4 Native
						</span>
						<span className="text-text-muted transition-transform group-hover:translate-x-0.5">
							→
						</span>
					</Link>

					<h1 className="max-w-160 text-text font-mono text-[clamp(2.5rem,5.5vw,4.25rem)] font-extrabold tracking-[-0.065em] leading-[0.94]">
						The editorial component library
						<br />
						<span className="text-text-secondary">
							for React & Tailwind v4.
						</span>
					</h1>

					<p className="max-w-140 text-text-secondary text-base sm:text-lg font-normal leading-relaxed">
						47 craft-obsessed, dark-first components built with OKLCH color
						tokens, razor-sharp hairlines, and zero runtime overhead. Designed
						for portfolios, technical writing, and developer products.
					</p>

					<div className="flex flex-wrap items-center gap-ml-3 pt-ml-2">
						<Button asChild size="md">
							<Link href="/docs/installation">Get started</Link>
						</Button>

						<Button asChild variant="secondary" size="md">
							<Link href="/docs/components">Explore 47 components</Link>
						</Button>

						<HomeQuickInstall />
					</div>
				</div>

				{/* HERO LIVE COMPONENT GRID (SHADCN-STYLE WITH FADE) */}
				<div className="w-full pt-ml-4">
					<HomeHeroGrid />
				</div>
			</section>

			{/* STATS & ATTRIBUTES RIBBON */}
			<section
				className="grid grid-cols-2 gap-ml-6 sm:grid-cols-5 border-y border-border py-ml-6 my-ml-16 items-center"
				aria-label="Key library attributes"
			>
				{stats.map((stat) => (
					<div key={stat.label} className="flex flex-col gap-ml-1">
						<strong className="font-mono text-2xl sm:text-3xl font-bold leading-none tracking-tight text-text">
							{stat.value}
						</strong>
						<span className="font-mono text-3xs font-semibold uppercase tracking-eyebrow text-text-muted">
							{stat.label}
						</span>
					</div>
				))}
			</section>

			{/* LIVE INTERACTIVE COMPONENT SHOWCASE */}
			<section className="flex flex-col gap-ml-8 my-ml-16">
				<div className="flex flex-col gap-ml-2">
					<SectionHead
						eyebrow={`Live Catalog · ${metadataJson.count} components`}
						title="Interactive components with taste."
						subtitle="Every component is keyboard-accessible, token-aware, and built for instant responsiveness."
						size="md"
						level={2}
					/>
				</div>

				<HomeComponentGallery />
			</section>

			{/* HOW IT WORKS / CODE TABS SECTION */}
			<section className="flex flex-col gap-ml-8 my-ml-16 border-t border-border pt-ml-16">
				<div className="flex flex-col gap-ml-2">
					<SectionHead
						eyebrow="Zero Friction · Pure CSS Tokens"
						title="One line to import. Three lines to rebrand."
						subtitle="Swap variables in your stylesheet to completely adapt colors, typography, and radiuses."
						size="md"
						level={2}
					/>
				</div>

				<HomeArchitectureTabs />
			</section>

			{/* EDITORIAL BOTTOM CTA */}
			<section className="mt-ml-16 mb-ml-6 overflow-hidden border border-border rounded-xl bg-surface-2/40 p-ml-8 sm:p-ml-12 text-center shadow-xs">
				<div className="mx-auto flex max-w-xl flex-col items-center gap-ml-4">
					<p className="m-0 font-mono text-3xs font-semibold uppercase tracking-eyebrow text-accent">
						MIT Licensed · Production Ready
					</p>
					<h2 className="m-0 font-mono text-2xl sm:text-3xl font-bold tracking-tight text-text">
						Build your next portfolio or documentation site with taste.
					</h2>
					<p className="m-0 text-sm text-text-secondary leading-relaxed">
						Start in under five minutes with Next.js App Router, Vite, or any
						modern React 19 environment.
					</p>
					<div className="flex flex-wrap items-center justify-center gap-ml-3 pt-ml-4">
						<Button asChild size="md">
							<Link href="/docs/installation">Read installation guide</Link>
						</Button>
						<Button asChild variant="secondary" size="md">
							<a
								href="https://github.com/chitranklabs/monoline-ui"
								target="_blank"
								rel="noopener noreferrer"
							>
								GitHub Repository ↗
							</a>
						</Button>
					</div>
				</div>
			</section>
		</Container>
	)
}
