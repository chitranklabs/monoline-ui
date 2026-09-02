import { Container } from "@chitrank2050/monoline-ui/container"
import { DataList } from "@chitrank2050/monoline-ui/data-list"
import { cn } from "@chitrank2050/monoline-ui/lib/utils"
import {
	SectionHead,
	type SectionHeadLevel,
} from "@chitrank2050/monoline-ui/section-head"

export interface ExperienceTimelineItem {
	company: string
	role: string
	period: string
	summary: string
}

export interface ExperienceTimelineProps {
	title?: string
	description?: string
	items: ExperienceTimelineItem[]
	headingLevel?: SectionHeadLevel
	className?: string
}

export function ExperienceTimeline({
	title = "Experience",
	description = "Roles, responsibilities, and the systems shipped along the way.",
	items,
	headingLevel = 2,
	className,
}: ExperienceTimelineProps) {
	return (
		<section className={cn("py-ml-16", className)} aria-label={title}>
			<Container size="md">
				<SectionHead
					title={title}
					subtitle={description}
					level={headingLevel}
				/>
				<DataList className="mt-ml-8" variant="numbered" size="lg">
					{items.map((item) => (
						<DataList.Item
							key={`${item.company}-${item.period}`}
							label={item.period}
							title={`${item.role} · ${item.company}`}
							description={item.summary}
						/>
					))}
				</DataList>
			</Container>
		</section>
	)
}
