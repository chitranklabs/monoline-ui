import { ArticleIndex } from "../../../registry/default/article-index-01/article-index-01"
import { ContactCta } from "../../../registry/default/contact-cta-01/contact-cta-01"
import { ExperienceTimeline } from "../../../registry/default/experience-timeline-01/experience-timeline-01"
import { ProfileHero } from "../../../registry/default/profile-hero-01/profile-hero-01"
import { ProjectIndex } from "../../../registry/default/project-index-01/project-index-01"

export function BlockPreview({ slug }: { slug: string }) {
	switch (slug) {
		case "profile-hero-01":
			return (
				<ProfileHero
					name="Mira Chen"
					jobTitle="Product engineer"
					location="Singapore"
					intro="I design and ship dependable interfaces for technical products."
					availability="Available Q4"
					primaryAction={{ label: "View projects", href: "#projects" }}
					secondaryAction={{ label: "About me", href: "#about" }}
					headingLevel={3}
				/>
			)
		case "project-index-01":
			return (
				<ProjectIndex
					headingLevel={3}
					projects={[
						{
							title: "Release observatory",
							description:
								"A deployment intelligence tool that makes production changes traceable.",
							href: "#release-observatory",
							year: "2026",
							tags: ["React", "Postgres", "OpenTelemetry"],
							result: "42% faster incident review",
						},
						{
							title: "Access graph",
							description:
								"A visual audit trail for multi-tenant authorization decisions.",
							href: "#access-graph",
							year: "2025",
							tags: ["TypeScript", "GraphQL"],
							result: "Zero cross-tenant incidents",
						},
					]}
				/>
			)
		case "article-index-01":
			return (
				<ArticleIndex
					headingLevel={3}
					articles={[
						{
							title: "Designing retry-safe webhooks",
							description:
								"Idempotency, reconciliation, and the failure cases worth testing.",
							href: "#retry-safe-webhooks",
							date: "12 Aug 2026",
							readingTime: "8 min",
							topic: "Backend",
						},
						{
							title: "What a component package should guarantee",
							description:
								"Consumer boundaries, CSS ownership, and compatibility contracts.",
							href: "#package-contracts",
							date: "28 Jul 2026",
							readingTime: "6 min",
							topic: "Frontend",
						},
					]}
				/>
			)
		case "experience-timeline-01":
			return (
				<ExperienceTimeline
					headingLevel={3}
					items={[
						{
							company: "Northstar",
							role: "Staff engineer",
							period: "2024—Now",
							summary:
								"Led the platform group through a multi-region reliability program.",
						},
						{
							company: "Foundry",
							role: "Senior engineer",
							period: "2021—2024",
							summary:
								"Built the authorization and billing foundations for a B2B product.",
						},
					]}
				/>
			)
		case "contact-cta-01":
			return (
				<ContactCta
					headingLevel={3}
					status="Taking on one project"
					description="Tell me what you are building, where it is stuck, and what a useful outcome looks like."
					actionLabel="Start a conversation"
					actionHref="mailto:hello@example.com"
				/>
			)
		default:
			return null
	}
}
