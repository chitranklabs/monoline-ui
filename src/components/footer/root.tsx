import { cn } from "../../lib/utils"
import { FooterSubscribeForm } from "./subscribe"
import type { FooterLink, FooterProps } from "./types"

function isExternalHref(link: FooterLink) {
	return link.external ?? /^(https?:|mailto:|tel:)/.test(link.href)
}

export function FooterRoot({
	size = "md",
	brand,
	description,
	status,
	localTime,
	columns,
	links,
	subscribe,
	credit,
	meta,
	attribution,
	linkComponent,
	className,
	ref,
	...props
}: FooterProps): React.ReactElement {
	const currentYear = new Date().getFullYear()
	const defaultMeta = `© ${currentYear}`
	const resolvedColumns =
		columns ??
		(links?.length
			? [
					{
						title: "Links",
						links,
					},
				]
			: [])
	const subscribeNode =
		subscribe === undefined ? <FooterSubscribeForm /> : subscribe
	const resolvedMeta = meta ?? credit ?? defaultMeta
	const columnCount = resolvedColumns.length + (subscribeNode ? 1 : 0)

	return (
		<footer
			ref={ref}
			data-slot="footer"
			data-size={size}
			className={cn(
				"ml-footer border-border bg-background w-full border-t text-body",
				className
			)}
			{...props}
		>
			<div className="ml-footer__container mx-auto w-full">
				<div className="ml-footer__layout grid">
					<div className="ml-footer__intro flex flex-col">
						{brand ? (
							<div className="ml-footer__brand font-script leading-none font-bold text-primary">
								{brand}
							</div>
						) : null}
						{description ? (
							<p className="ml-footer__description text-body">{description}</p>
						) : null}
						{status || localTime ? (
							<div className="flex flex-wrap items-center gap-x-ml-5 gap-y-ml-3">
								{status}
								{localTime ? (
									<span className="text-muted-foreground font-mono text-xs tracking-(--ml-footer-local-time-tracking)">
										{localTime}
									</span>
								) : null}
							</div>
						) : null}
					</div>

					<div
						className={cn(
							"ml-footer__columns grid min-w-0",
							columnCount <= 1 && "grid-cols-1",
							columnCount === 2 && "grid-cols-2",
							columnCount >= 3 && "grid-cols-2 md:grid-cols-3"
						)}
					>
						{resolvedColumns.map((column, index) => (
							<nav
								key={`${String(column.title)}-${index}`}
								aria-label={
									typeof column.title === "string" ? column.title : undefined
								}
								className="flex min-w-0 flex-col gap-ml-3"
							>
								<span className="ml-eyebrow block">{column.title}</span>
								{column.links.map((link, linkIndex) => {
									const external = isExternalHref(link)
									const LinkComp = link.as ?? linkComponent ?? "a"

									return (
										<LinkComp
											key={`${link.href}-${linkIndex}`}
											href={link.href}
											target={link.target ?? (external ? "_blank" : undefined)}
											rel={
												link.rel ??
												(external ? "noopener noreferrer" : undefined)
											}
											className="ml-footer__link group/link inline-flex w-fit items-center leading-none text-body no-underline transition-[color,box-shadow] duration-(--duration-micro) ease-(--ease-out) hover:text-primary focus-visible:outline-none focus-visible:shadow-(--focus-ring)"
										>
											<span>{link.label}</span>
											{external ? (
												<span
													className="text-muted-foreground ml-ml-1 transition-[color,opacity] duration-(--duration-micro) ease-(--ease-out) group-hover/link:text-primary"
													aria-hidden="true"
												>
													↗
												</span>
											) : null}
										</LinkComp>
									)
								})}
							</nav>
						))}
						{subscribeNode ? (
							<div className="col-span-2 hidden min-w-0 flex-col gap-ml-3 md:col-span-1 md:flex">
								<span className="ml-eyebrow block">Subscribe</span>
								{subscribeNode}
							</div>
						) : null}
					</div>
				</div>

				<div className="ml-footer__meta text-muted-foreground border-border flex flex-col gap-ml-3 border-t font-mono leading-relaxed md:flex-row md:items-start md:justify-between">
					{resolvedMeta ? (
						<p className="max-w-(--ml-footer-meta-copy-max)">{resolvedMeta}</p>
					) : null}
					{attribution ? <p>{attribution}</p> : null}
				</div>
			</div>
		</footer>
	)
}
