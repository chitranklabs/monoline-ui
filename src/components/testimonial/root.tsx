import { cn } from "../../lib/utils"
import { Avatar } from "../avatar"
import type { TestimonialProps, TestimonialSize } from "./types"

const testimonialSizeClasses: Record<TestimonialSize, string> = {
	sm: "gap-ml-3 p-ml-4",
	md: "gap-ml-4 p-ml-5",
	lg: "gap-ml-5 p-ml-7",
}

const quoteSizeClasses: Record<TestimonialSize, string> = {
	sm: "text-sm leading-[1.55]",
	md: "text-[14.5px] leading-[1.6]",
	lg: "font-headline text-[17px] leading-[1.6] font-medium",
}

export function TestimonialRoot({
	className,
	quote,
	author,
	role,
	initials,
	avatarSrc,
	avatarAlt,
	size = "md",
	...props
}: TestimonialProps) {
	return (
		<figure
			className={cn(
				"flex flex-col rounded-2xl border border-border bg-surface",
				testimonialSizeClasses[size],
				className
			)}
			{...props}
		>
			<span
				aria-hidden="true"
				className="font-mono text-[32px] leading-[0.5] text-accent opacity-70"
			>
				“
			</span>
			<blockquote
				className={cn("m-0 text-pretty text-body", quoteSizeClasses[size])}
			>
				{quote}
			</blockquote>
			<figcaption className="mt-ml-2 flex items-center gap-ml-3 border-t border-border pt-ml-4">
				<Avatar size="md" src={avatarSrc} alt={avatarAlt}>
					{initials}
				</Avatar>
				<div className="flex flex-col">
					<span className="text-[13px] font-medium text-primary">{author}</span>
					{role ? (
						<span className="font-mono text-[11px] text-muted-foreground">
							{role}
						</span>
					) : null}
				</div>
			</figcaption>
		</figure>
	)
}
