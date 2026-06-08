import { cn } from "../../lib/utils"
import { FooterSubscribeForm } from "./subscribe"
import type { FooterColumn, FooterLink, FooterProps } from "./types"

function isExternalHref(link: FooterLink) {
	return link.external ?? /^(https?:|mailto:|tel:)/.test(link.href)
}

const defaultColumns: FooterColumn[] = [
	{
		title: "Navigate",
		links: [
			{ href: "/project", label: "Projects" },
			{ href: "/blog", label: "Blog" },
			{ href: "/#about", label: "About" },
			{ href: "/now", label: "Now" },
		],
	},
	{
		title: "Elsewhere",
		links: [
			{
				href: "https://www.linkedin.com",
				label: "LinkedIn",
				external: true,
			},
			{ href: "https://github.com", label: "GitHub", external: true },
			{ href: "https://x.com", label: "X / Twitter", external: true },
			{ href: "mailto:hello@example.com", label: "Email", external: true },
		],
	},
]

const footerSizeClasses = {
	sm: {
		root: "py-footer-y-sm sm:py-footer-y-sm-tablet lg:py-footer-y-sm-desktop",
		container:
			"max-w-5xl px-footer-x-sm sm:px-footer-x-sm-tablet lg:px-footer-x-sm-desktop",
		layout:
			"gap-footer-layout-gap-sm lg:grid-cols-(--ml-footer-layout-cols-sm-desktop) lg:gap-footer-layout-gap-sm-desktop",
		intro: "max-w-(--ml-footer-intro-max-sm) gap-footer-intro-gap-sm",
		brand: "text-4xl sm:text-5xl lg:text-3xl",
		description:
			"max-w-(--ml-footer-description-max-sm) text-sm leading-(--ml-footer-description-leading-sm)",
		columns: "gap-x-footer-column-gap-x-sm gap-y-footer-column-gap-y-sm",
		link: "min-h-(--ml-footer-link-min-height-sm) text-sm",
		meta: "mt-footer-meta-mt-sm pt-footer-meta-pt-sm text-(length:--ml-footer-meta-text-sm)",
	},
	md: {
		root: "py-footer-y-md sm:py-footer-y-md-tablet lg:py-footer-y-md-desktop",
		container:
			"max-w-7xl px-footer-x-md sm:px-footer-x-md-tablet lg:px-footer-x-md-desktop",
		layout:
			"gap-footer-layout-gap-md lg:grid-cols-(--ml-footer-layout-cols-md-desktop) lg:gap-footer-layout-gap-md-desktop",
		intro: "max-w-(--ml-footer-intro-max-md) gap-footer-intro-gap-md",
		brand: "text-5xl sm:text-6xl lg:text-4xl",
		description:
			"max-w-(--ml-footer-description-max-md) text-base leading-(--ml-footer-description-leading-md)",
		columns: "gap-x-footer-column-gap-x-md gap-y-footer-column-gap-y-md",
		link: "min-h-(--ml-footer-link-min-height-md) text-base",
		meta: "mt-footer-meta-mt-md pt-footer-meta-pt-md text-(length:--ml-footer-meta-text-md)",
	},
	lg: {
		root: "py-footer-y-lg sm:py-footer-y-lg-tablet lg:py-footer-y-lg-desktop",
		container:
			"max-w-(--ml-footer-container-max-lg) px-footer-x-lg sm:px-footer-x-lg-tablet lg:px-footer-x-lg-desktop",
		layout:
			"gap-footer-layout-gap-lg lg:grid-cols-(--ml-footer-layout-cols-lg-desktop) lg:gap-footer-layout-gap-lg-desktop",
		intro: "max-w-(--ml-footer-intro-max-lg) gap-footer-intro-gap-lg",
		brand: "text-6xl sm:text-7xl lg:text-5xl",
		description:
			"max-w-(--ml-footer-description-max-lg) text-lg leading-(--ml-footer-description-leading-lg)",
		columns: "gap-x-footer-column-gap-x-lg gap-y-footer-column-gap-y-lg",
		link: "min-h-(--ml-footer-link-min-height-lg) text-lg",
		meta: "mt-footer-meta-mt-lg pt-footer-meta-pt-lg text-(length:--ml-footer-meta-text-lg)",
	},
} as const

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
	...props
}: FooterProps) {
	const sizeClasses = footerSizeClasses[size]
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
			: defaultColumns)
	const subscribeNode =
		subscribe === undefined ? <FooterSubscribeForm /> : subscribe
	const resolvedMeta = meta ?? credit ?? defaultMeta
	const columnCount = resolvedColumns.length + (subscribeNode ? 1 : 0)

	return (
		<footer
			data-slot="footer"
			className={cn(
				"border-border bg-background w-full border-t text-body",
				sizeClasses.root,
				className
			)}
			{...props}
		>
			<div className={cn("mx-auto w-full", sizeClasses.container)}>
				<div className={cn("grid grid-cols-1", sizeClasses.layout)}>
					<div className={cn("flex flex-col", sizeClasses.intro)}>
						{brand ? (
							<div
								className={cn(
									"font-script leading-none font-bold text-primary",
									sizeClasses.brand
								)}
							>
								{brand}
							</div>
						) : null}
						{description ? (
							<p className={cn("text-body", sizeClasses.description)}>
								{description}
							</p>
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
							"grid min-w-0",
							sizeClasses.columns,
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
											className={cn(
												"group/link inline-flex w-fit items-center leading-none text-body no-underline transition-[color,box-shadow,transform] duration-(--duration-micro) ease-out motion-safe:hover:translate-x-(--ml-footer-link-hover-x) hover:text-primary focus-visible:outline-none focus-visible:shadow-(--focus-ring)",
												sizeClasses.link
											)}
										>
											<span>{link.label}</span>
											{external ? (
												<span
													className="text-muted-foreground ml-ml-1 transition-transform duration-(--duration-short) ease-out-expo group-hover/link:translate-x-(--ml-footer-link-arrow-hover-x)"
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

				<div
					className={cn(
						"text-muted-foreground border-border flex flex-col gap-ml-3 border-t font-mono leading-relaxed md:flex-row md:items-start md:justify-between",
						sizeClasses.meta
					)}
				>
					{resolvedMeta ? (
						<p className="max-w-(--ml-footer-meta-copy-max)">{resolvedMeta}</p>
					) : null}
					{attribution ? <p>{attribution}</p> : null}
				</div>
			</div>
		</footer>
	)
}
