import { Avatar } from "@chitrank2050/monoline-ui/avatar"
import { Button } from "@chitrank2050/monoline-ui/button"
import { Container } from "@chitrank2050/monoline-ui/container"
import { cn } from "@chitrank2050/monoline-ui/lib/utils"
import { MetaRow } from "@chitrank2050/monoline-ui/meta-row"
import {
	SectionHead,
	type SectionHeadLevel,
} from "@chitrank2050/monoline-ui/section-head"
import { Status } from "@chitrank2050/monoline-ui/status"

export interface ProfileHeroAction {
	label: string
	href: string
}

export interface ProfileHeroProps {
	name: string
	jobTitle: string
	location: string
	intro: string
	availability?: string
	avatarSrc?: string
	avatarAlt?: string
	primaryAction: ProfileHeroAction
	secondaryAction?: ProfileHeroAction
	headingLevel?: SectionHeadLevel
	className?: string
}

export function ProfileHero({
	name,
	jobTitle,
	location,
	intro,
	availability,
	avatarSrc,
	avatarAlt = "",
	primaryAction,
	secondaryAction,
	headingLevel = 1,
	className,
}: ProfileHeroProps) {
	return (
		<section className={cn("border-b border-border py-ml-20", className)}>
			<Container
				size="lg"
				className="grid gap-ml-10 lg:grid-cols-[1fr_auto] lg:items-end"
			>
				<div className="max-w-3xl">
					<MetaRow className="mb-ml-6">
						<span>{jobTitle}</span>
						<MetaRow.Sep />
						<span>{location}</span>
					</MetaRow>
					<SectionHead
						level={headingLevel}
						size="xl"
						eyebrow="Profile"
						title={name}
						lede={intro}
					/>
					<div className="mt-ml-8 flex flex-wrap items-center gap-ml-3">
						<Button asChild size="lg">
							<a href={primaryAction.href}>{primaryAction.label}</a>
						</Button>
						{secondaryAction ? (
							<Button asChild size="lg" variant="secondary">
								<a href={secondaryAction.href}>{secondaryAction.label}</a>
							</Button>
						) : null}
					</div>
				</div>
				<div className="flex items-end gap-ml-4 lg:flex-col lg:items-end">
					<Avatar size="2xl" src={avatarSrc} alt={avatarAlt}>
						{name.slice(0, 2).toUpperCase()}
					</Avatar>
					{availability ? (
						<Status variant="success">{availability}</Status>
					) : null}
				</div>
			</Container>
		</section>
	)
}
