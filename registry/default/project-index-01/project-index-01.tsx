import { Badge } from "@chitrank2050/monoline-ui/badge"
import { Card } from "@chitrank2050/monoline-ui/card"
import { Container } from "@chitrank2050/monoline-ui/container"
import { cn } from "@chitrank2050/monoline-ui/lib/utils"
import {
	SectionHead,
	type SectionHeadLevel,
} from "@chitrank2050/monoline-ui/section-head"

export interface ProjectIndexItem {
	title: string
	description: string
	href: string
	year: string
	tags: string[]
	result?: string
}

export interface ProjectIndexProps {
	title?: string
	description?: string
	projects: ProjectIndexItem[]
	headingLevel?: SectionHeadLevel
	className?: string
}

export function ProjectIndex({
	title = "Selected work",
	description = "A focused selection of shipped products and engineering systems.",
	projects,
	headingLevel = 2,
	className,
}: ProjectIndexProps) {
	return (
		<section className={cn("py-ml-16", className)} aria-label={title}>
			<Container size="lg">
				<SectionHead
					title={title}
					subtitle={description}
					level={headingLevel}
				/>
				<div className="mt-ml-8 grid gap-ml-4 md:grid-cols-2">
					{projects.map((project) => (
						<Card key={project.href} href={project.href} size="lg">
							<Card.Header>
								<Card.Eyebrow>{project.year}</Card.Eyebrow>
								<Card.Title>{project.title}</Card.Title>
							</Card.Header>
							<Card.Body>
								<Card.Description lines={3}>
									{project.description}
								</Card.Description>
								{project.result ? (
									<Card.Meta>{project.result}</Card.Meta>
								) : null}
							</Card.Body>
							<Card.Footer>
								<Card.TagList totalCount={project.tags.length}>
									{project.tags.slice(0, 3).map((tag) => (
										<Badge key={tag} variant="outline">
											{tag}
										</Badge>
									))}
								</Card.TagList>
								<Card.Arrow />
							</Card.Footer>
						</Card>
					))}
				</div>
			</Container>
		</section>
	)
}
