import { cn } from "../../lib/utils"
import { Eyebrow } from "../eyebrow"
import type { AuthorFooterProps } from "./types"

export function AuthorFooterRoot({
	className,
	name,
	bio,
	avatar,
	links,
	stack = false,
	ref,
	...props
}: AuthorFooterProps) {
	return (
		<section
			ref={ref}
			className={cn(
				"ml-author-footer",
				stack && "ml-author-footer--stack",
				className
			)}
			{...props}
		>
			{avatar && <div className="ml-author-footer__avatar">{avatar}</div>}
			<div className="ml-author-footer__body">
				<Eyebrow>Written by</Eyebrow>
				<div className="ml-author-footer__name">{name}</div>
				{bio && <p className="ml-author-footer__bio">{bio}</p>}
			</div>
			{links && links.length > 0 && (
				<div className="ml-author-footer__links">
					{links.map((link) => (
						<a
							key={link.href}
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
							className="ml-author-footer__link"
						>
							{link.label}
						</a>
					))}
				</div>
			)}
		</section>
	)
}
