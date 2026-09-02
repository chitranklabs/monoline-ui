import { Button } from "@chitrank2050/monoline-ui/button"
import { Container } from "@chitrank2050/monoline-ui/container"
import { cn } from "@chitrank2050/monoline-ui/lib/utils"
import {
	SectionHead,
	type SectionHeadLevel,
} from "@chitrank2050/monoline-ui/section-head"
import { Status } from "@chitrank2050/monoline-ui/status"

export interface ContactCtaProps {
	title?: string
	description: string
	actionLabel: string
	actionHref: string
	status?: string
	headingLevel?: SectionHeadLevel
	className?: string
}

export function ContactCta({
	title = "Have a project in mind?",
	description,
	actionLabel,
	actionHref,
	status,
	headingLevel = 2,
	className,
}: ContactCtaProps) {
	return (
		<section
			className={cn("border-y border-border py-ml-16", className)}
			aria-label={title}
		>
			<Container
				size="md"
				className="grid gap-ml-8 sm:grid-cols-[1fr_auto] sm:items-end"
			>
				<div>
					{status ? (
						<Status variant="success" className="mb-ml-4">
							{status}
						</Status>
					) : null}
					<SectionHead
						title={title}
						lede={description}
						level={headingLevel}
						size="lg"
					/>
				</div>
				<Button asChild size="lg">
					<a href={actionHref}>{actionLabel}</a>
				</Button>
			</Container>
		</section>
	)
}
