import { cn } from "../../lib/utils"
import { Avatar } from "../avatar"
import type { TestimonialProps } from "./types"

export function TestimonialRoot({
	className,
	quote,
	author,
	authorHref,
	role,
	initials,
	avatarSrc,
	avatarAlt,
	size = "md",
	variant = "default",
	ref,
	...props
}: TestimonialProps) {
	return (
		<figure
			ref={ref}
			data-slot="testimonial"
			data-size={size}
			data-variant={variant}
			className={cn("ml-testimonial", className)}
			{...props}
		>
			{variant === "default" ? (
				<span aria-hidden="true" className="ml-testimonial__mark">
					“
				</span>
			) : null}
			<blockquote className="ml-testimonial__quote">{quote}</blockquote>
			<figcaption className="ml-testimonial__author">
				<Avatar size="md" src={avatarSrc} alt={avatarAlt}>
					{initials}
				</Avatar>
				<div className="ml-testimonial__author-copy">
					{authorHref ? (
						<a
							href={authorHref}
							target="_blank"
							rel="noopener noreferrer"
							className="ml-testimonial__name"
						>
							{author}
						</a>
					) : (
						<span className="ml-testimonial__name">{author}</span>
					)}
					{role ? <span className="ml-testimonial__role">{role}</span> : null}
				</div>
			</figcaption>
		</figure>
	)
}
