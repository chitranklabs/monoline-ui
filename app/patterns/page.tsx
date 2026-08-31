import type { Metadata } from "next"

import { Callout } from "@chitrank2050/monoline-ui/callout"
import { Card } from "@chitrank2050/monoline-ui/card"
import { CodeBlock } from "@chitrank2050/monoline-ui/code-block"

import { DocsShell } from "../_components/docs-shell"
import JsonLd, {
	createBreadcrumbJsonLd,
	createTechArticleJsonLd,
} from "../_components/json-ld"
import "../_styles/guide-pages.css"
import { createPageMetadata } from "../lib/metadata"

const displayTitle = "Patterns"
const pageDescription =
	"Compose monoline/ui components into practical React patterns for project indexes, filters, loading states, forms, documentation, and editorial interfaces."

export const metadata: Metadata = createPageMetadata({
	title: "React Interface Composition Patterns | monoline/ui Docs",
	description: pageDescription,
	path: "/patterns",
})

const projectIndexCode = `import { Card } from "@chitrank2050/monoline-ui/card"

export function ProjectIndex({ projects }) {
  return (
    <section aria-labelledby="projects-title">
      <h2 id="projects-title">Selected projects</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.slug} href={\`/projects/\${project.slug}\`}>
            <Card.Body>
              <Card.Eyebrow>{project.year}</Card.Eyebrow>
              <Card.Title>{project.title}</Card.Title>
              <Card.Description>{project.summary}</Card.Description>
            </Card.Body>
          </Card>
        ))}
      </div>
    </section>
  )
}`

const asyncCode = `return error ? (
  <Callout variant="warn" label="Projects unavailable">
    Try again in a moment.
  </Callout>
) : loading ? (
  <div aria-label="Loading projects">
    <Skeleton className="h-40" />
  </div>
) : projects.length === 0 ? (
  <Callout variant="note">No projects match these filters.</Callout>
) : (
  <ProjectGrid projects={projects} />
)`

const patternCards = [
	{
		title: "Project or article index",
		description:
			"Pair SectionHead with linked Cards. Keep the whole card destination predictable and the summary specific.",
		href: "/components/card",
		components: "SectionHead · Card · Tag",
	},
	{
		title: "Filterable collection",
		description:
			"Use Tag for independent filters or SegmentedControl for one choice. Put durable filter state in the URL.",
		href: "/components/segmented-control",
		components: "Tag · SegmentedControl · DataList",
	},
	{
		title: "Form with feedback",
		description:
			"Compose Field, Label, Input or Textarea, and explicit error relationships; disable the submitting Button, then announce the result.",
		href: "/components/field",
		components: "Field · Label · Input · Button",
	},
	{
		title: "Documentation article",
		description:
			"Combine a table of contents, code examples, notes, and previous/next navigation around a semantic article outline.",
		href: "/components/toc",
		components: "TOC · CodeBlock · Callout",
	},
] as const

export default function PatternsPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			createTechArticleJsonLd({
				title: displayTitle,
				description: pageDescription,
				path: "/patterns",
			}),
			createBreadcrumbJsonLd([
				{ name: "Monoline UI", path: "/" },
				{ name: displayTitle, path: "/patterns" },
			]),
		],
	}

	return (
		<DocsShell>
			<main id="main-content" tabIndex={-1} className="docs-page">
				<JsonLd data={jsonLd} />
				<header className="docs-page__head">
					<p className="ml-eyebrow">Product guide · Patterns</p>
					<h1>{displayTitle}</h1>
					<p>
						These recipes solve recurring interface problems without hiding the
						markup. Start with a pattern, then keep only the pieces your content
						needs.
					</p>
				</header>

				<section className="docs-section" aria-labelledby="recipes-title">
					<div className="docs-subhead">
						<h2 id="recipes-title">Composition recipes</h2>
						<p>
							Each recipe links to the component that carries the main
							interaction or content structure.
						</p>
					</div>
					<div className="grid grid-cols-1 gap-ml-4 md:grid-cols-2">
						{patternCards.map((pattern) => (
							<Card key={pattern.title} href={pattern.href}>
								<Card.Body>
									<Card.Eyebrow>{pattern.components}</Card.Eyebrow>
									<Card.Title>{pattern.title}</Card.Title>
									<Card.Description lines={4}>
										{pattern.description}
									</Card.Description>
								</Card.Body>
							</Card>
						))}
					</div>
				</section>

				<section className="docs-section" aria-labelledby="index-title">
					<div className="docs-subhead">
						<h2 id="index-title">Linked project index</h2>
						<p>
							A collection page should expose real links in its initial markup.
							The card contains one destination, so its title and summary
							describe that page.
						</p>
					</div>
					<CodeBlock
						filename="project-index.tsx"
						language="tsx"
						code={projectIndexCode}
					/>
				</section>

				<section className="docs-section" aria-labelledby="states-title">
					<div className="docs-subhead">
						<h2 id="states-title">Async collection states</h2>
						<p>
							Loading, empty, error, and success are separate states. Give each
							one useful copy instead of leaving an unexplained blank region.
						</p>
					</div>
					<CodeBlock
						filename="project-results.tsx"
						language="tsx"
						code={asyncCode}
					/>
				</section>

				<div className="docs-section">
					<Callout variant="note" label="Choose the smallest pattern">
						A static list does not need client state. Add filters, disclosure,
						or async behavior only when the reader can use it to complete a
						task.
					</Callout>
				</div>
			</main>
		</DocsShell>
	)
}
