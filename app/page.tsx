import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@chitrank2050/monoline-ui/button"
import { Card } from "@chitrank2050/monoline-ui/card"
import { Container } from "@chitrank2050/monoline-ui/container"
import metadataJson from "@chitrank2050/monoline-ui/metadata.json"
import { SectionHead } from "@chitrank2050/monoline-ui/section-head"
import { Status } from "@chitrank2050/monoline-ui/status"

import pkg from "../package.json"
import { CliBadge } from "./_components/cli-badge"
import { CodeBlock } from "./_components/component-playground"
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
	[String(metadataJson.count), "Components"],
	["2", "Themes"],
	[metadataJson.size, "Gzipped"],
	["MIT", "License"],
]

const builtFor = [
	["Personal portfolios", "Editorial layout, long-form posts"],
	["Developer docs", "Code blocks, callouts, TOC"],
	["Product sites", "Hero, feature, and footer sections"],
	["Internal tools", "Cards, tables, status tags"],
]

const components = [
	["Card", "Linked, static, or button-backed content cards"],
	["SectionHead", "Eyebrow, title, and lede block"],
	["Container", "Max-width content wrapper"],
	["ActionRail", "Compact action groups"],
	["Navbar", "Responsive site header"],
	["Footer", "Brand, links, subscribe, and meta rows"],
	["Rail", "Vertical secondary navigation"],
	["Toc", "Table of contents with active tracking"],
	["Button", "Actions, links, icons, and loading state"],
	["Input", "Text fields with prefix and suffix slots"],
	["Toggle", "Accessible switch control"],
	["SegmentedControl", "Single-select control groups"],
]

const rules = [
	[
		"01",
		"Two themes, one source of truth",
		'Set data-theme="light" or data-theme="dark" on <html>. Components read the same tokens in both modes.',
	],
	[
		"02",
		"CSS tokens, not Tailwind config",
		"Colors, fonts, radii, spacing, and motion live in theme.css. Swap the token layer to rebrand.",
	],
	[
		"03",
		"No icon set baked in",
		"Bring lucide, react-icons, SVGs, or your own glyphs. Components expose slots instead of icon opinions.",
	],
]

function PreviewCard() {
	return (
		<div
			className="intro-preview overflow-hidden border border-border rounded-xl bg-surface shadow-md mt-ml-10 ml-ml-1-5"
			aria-label="Component preview"
		>
			<div className="flex h-8.5 items-center justify-between border-b border-border bg-surface-2 px-ml-4 font-mono text-2xs font-bold text-text-muted">
				<div className="flex gap-ml-2">
					<span
						className="size-ml-2 rounded-full"
						style={{ backgroundColor: "var(--mac-red)" }}
					/>
					<span
						className="size-ml-2 rounded-full"
						style={{ backgroundColor: "var(--mac-amber)" }}
					/>
					<span
						className="size-ml-2 rounded-full"
						style={{ backgroundColor: "var(--mac-green)" }}
					/>
				</div>
				<p>card.tsx</p>
			</div>
			<div className="grid gap-ml-3-5 p-ml-3-5">
				<div className="flex items-center gap-ml-2">
					<Button size="sm">Contact me</Button>
					<Button size="sm" variant="secondary">
						Resume
					</Button>
				</div>
				<Card
					size="sm"
					href="/components/card"
					className="intro-preview__article"
				>
					<Card.Body>
						<p>Engineering · 9 min</p>
						<h2>Designing a type-safe BFF</h2>
					</Card.Body>
					<Card.Footer>
						<small>May 12, 2026</small>
						<Card.Arrow />
					</Card.Footer>
				</Card>
				<CodeBlock
					code={`<Card href="/blog/designing-a-type-safe-bff">
  <CardBody>
    <Eyebrow>Engineering</Eyebrow>
    <h3>Designing a type-safe BFF</h3>
  </CardBody>
</Card>`}
				/>
			</div>
		</div>
	)
}

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
			className="intro-page pt-ml-24"
		>
			<JsonLd data={jsonLd} />
			<section className="intro-hero grid grid-cols-[minmax(0,1fr)_25.5rem] items-start gap-ml-12">
				<div className="intro-hero__copy">
					<div className="intro-pills flex flex-wrap gap-ml-2-5 mb-ml-6">
						<Status variant="accent" size="md" animate>
							{release.version}
						</Status>
					</div>
					<h1 className="max-w-140 text-text font-mono text-[clamp(2.6875rem,5.3vw,3.875rem)] font-extrabold tracking-[-0.073em] leading-[0.915]">
						A React component library
						<br />
						<span className="text-text-secondary">with a point of view.</span>
					</h1>
					<p className="max-w-117.5 mt-ml-4 text-text-secondary text-base font-medium leading-normal">
						{metadataJson.count} components for personal sites, portfolios, and
						developer docs. Monochrome by default, one warm accent, two themes.
						Drop in the package, change the brand color, and ship.
					</p>
					<div className="intro-actions flex flex-wrap items-center gap-x-ml-5 gap-y-ml-3 mt-ml-5">
						<Button asChild>
							<Link href="/installation">
								Get started
								<Button.Arrow />
							</Link>
						</Button>
						<Button asChild variant="secondary">
							<Link href="/components">Browse components</Link>
						</Button>
						<CliBadge />
					</div>
				</div>
				<PreviewCard />
			</section>

			<section
				className="intro-stats grid grid-cols-4 gap-ml-6 mt-ml-11 border-y border-border py-ml-5 min-h-37.5 items-center"
				aria-label="Project stats"
			>
				{stats.map(([value, label]) => (
					<div key={label}>
						<strong className="block font-mono text-xl font-bold leading-none tracking-heading text-text">
							{value}
						</strong>
						<span className="mt-ml-1-5 block font-mono text-3xs font-bold uppercase tracking-eyebrow text-text-muted">
							{label}
						</span>
					</div>
				))}
			</section>

			<section className="intro-band mt-ml-20 border-b border-border pb-ml-8">
				<p className="ml-eyebrow">Built for</p>
				<div className="intro-band__grid grid grid-cols-4 gap-ml-8 mt-ml-4">
					{builtFor.map(([title, description]) => (
						<div key={title}>
							<h2 className="text-text text-sm font-bold tracking-body">
								{title}
							</h2>
							<p className="mt-ml-1-5 text-text-muted text-xs font-medium leading-normal">
								{description}
							</p>
						</div>
					))}
				</div>
			</section>

			<section className="intro-section mt-ml-20 pt-ml-8">
				<div className="intro-section__head flex items-end justify-between gap-ml-6">
					<SectionHead
						eyebrow={`Inside the box · ${metadataJson.count} components`}
						title="Components for editorial products."
						size="sm"
						level={2}
					/>
					<Link
						href="/components"
						className="intro-section__link group inline-flex items-center gap-ml-2 shrink-0 text-xs font-medium no-underline transition-colors duration-(--duration-short) ease-out text-accent"
					>
						All components
						<span
							aria-hidden="true"
							className="inline-block h-px w-5 bg-current transition-[width] duration-(--duration-short) ease-out group-hover:w-7"
						/>
					</Link>
				</div>
				<div className="intro-components grid grid-cols-4 gap-ml-2 mt-ml-6">
					{components.map(([title, description]) => (
						<Card key={title} size="sm">
							<Card.Body>
								<h3 className="m-0 text-sm font-bold tracking-body text-text">
									{title}
								</h3>
								<p className="m-0 mt-ml-1-5 text-xs font-medium leading-normal text-text-muted">
									{description}
								</p>
							</Card.Body>
						</Card>
					))}
				</div>
			</section>

			<section className="intro-section intro-section--rules mt-ml-20 pt-ml-8 mb-ml-20">
				<SectionHead
					eyebrow="Three rules · why this exists"
					title="Opinionated defaults, practical escape hatches."
					size="sm"
					level={2}
				/>
				<div className="intro-rules grid grid-cols-3 gap-ml-6 mt-ml-8">
					{rules.map(([number, title, description]) => (
						<Card key={number} size="md">
							<Card.Body>
								<span className="mb-ml-2-5 block font-mono text-2xs font-bold text-accent">
									{number}
								</span>
								<h3 className="m-0 mb-ml-2 text-base font-semibold tracking-body text-text">
									{title}
								</h3>
								<p className="m-0 text-xs font-medium leading-normal text-text-muted">
									{description}
								</p>
							</Card.Body>
						</Card>
					))}
				</div>
			</section>
		</Container>
	)
}
