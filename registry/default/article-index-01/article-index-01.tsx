import { Card } from "@chitrank2050/monoline-ui/card"
import { Container } from "@chitrank2050/monoline-ui/container"
import { cn } from "@chitrank2050/monoline-ui/lib/utils"
import { MetaRow } from "@chitrank2050/monoline-ui/meta-row"
import {
	SectionHead,
	type SectionHeadLevel,
} from "@chitrank2050/monoline-ui/section-head"

export interface ArticleIndexItem {
	title: string
	description: string
	href: string
	date: string
	readingTime: string
	topic: string
}

export interface ArticleIndexProps {
	title?: string
	description?: string
	articles: ArticleIndexItem[]
	headingLevel?: SectionHeadLevel
	className?: string
}

export function ArticleIndex({
	title = "Writing",
	description = "Notes from building and operating software.",
	articles,
	headingLevel = 2,
	className,
}: ArticleIndexProps) {
	return (
		<section className={cn("py-ml-16", className)} aria-label={title}>
			<Container size="md">
				<SectionHead
					title={title}
					subtitle={description}
					level={headingLevel}
				/>
				<div className="mt-ml-8 grid gap-ml-3">
					{articles.map((article) => (
						<Card key={article.href} href={article.href}>
							<Card.Body>
								<MetaRow>
									<time>{article.date}</time>
									<MetaRow.Sep />
									<span>{article.readingTime}</span>
									<MetaRow.Sep />
									<span>{article.topic}</span>
								</MetaRow>
								<Card.Title>{article.title}</Card.Title>
								<Card.Description lines={2}>
									{article.description}
								</Card.Description>
							</Card.Body>
							<Card.Action>
								<Card.Arrow />
							</Card.Action>
						</Card>
					))}
				</div>
			</Container>
		</section>
	)
}
