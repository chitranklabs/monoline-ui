import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { CodeBlock } from "@chitrank2050/monoline-ui/code-block"

import JsonLd, {
	createBreadcrumbJsonLd,
	createTechArticleJsonLd,
} from "../../../_components/json-ld"
import { blockPath, blockSlugs, getBlock } from "../../../lib/blocks"
import { createPageMetadata } from "../../../lib/metadata"
import { BlockPreview } from "../block-preview"

export function generateStaticParams() {
	return blockSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params
	const block = getBlock(slug)
	if (!block) return {}

	return createPageMetadata({
		title: `${block.title} React Portfolio Block | monoline/ui Docs`,
		description: block.seoDescription,
		path: blockPath(block.name),
	})
}

export default async function BlockPage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const block = getBlock(slug)
	if (!block) notFound()
	const command = `pnpm dlx shadcn@latest add chitranklabs/monoline-ui/${block.name}`
	const path = blockPath(block.name)
	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			createTechArticleJsonLd({
				title: block.title,
				description: block.seoDescription,
				path,
			}),
			createBreadcrumbJsonLd([
				{ name: "Monoline UI", path: "/" },
				{ name: "Blocks", path: "/docs/blocks" },
				{ name: block.title, path },
			]),
		],
	}

	return (
		<main id="main-content" tabIndex={-1} className="docs-page">
			<JsonLd data={jsonLd} />
			<header className="docs-page__head">
				<p className="ml-eyebrow">Registry block</p>
				<h1>{block.title}</h1>
				<p>{block.description}</p>
			</header>
			<section className="docs-section" aria-labelledby="preview-title">
				<div className="docs-subhead">
					<h2 id="preview-title">Preview</h2>
					<p>
						The block uses Monoline components and adapts to the active light or
						dark theme.
					</p>
				</div>
				<div className="overflow-hidden rounded-xl border border-border bg-bg">
					<BlockPreview slug={block.name} />
				</div>
			</section>
			<section className="docs-section" aria-labelledby="install-title">
				<div className="docs-subhead">
					<h2 id="install-title">Install from GitHub</h2>
					<p>
						The CLI copies the block into your configured components directory
						and adds the package dependency.
					</p>
				</div>
				<CodeBlock code={command} language="bash" filename="Terminal" />
			</section>
			<section className="docs-section" aria-labelledby="ownership-title">
				<div className="docs-subhead">
					<h2 id="ownership-title">Own the composition</h2>
				</div>
				<p>
					Registry blocks are source code, not another runtime layer. Change the
					content model and layout in your application while keeping Monoline
					tokens and primitives underneath.
				</p>
			</section>
		</main>
	)
}
