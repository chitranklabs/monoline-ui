import type * as React from "react"

export interface FooterLink {
	href: string
	label: React.ReactNode
	external?: boolean
	rel?: string
	target?: React.HTMLAttributeAnchorTarget
}

export interface FooterColumn {
	title: React.ReactNode
	links: FooterLink[]
}

export type FooterSize = "sm" | "md" | "lg"

export interface FooterSubscribeFormProps extends Omit<
	React.ComponentProps<"form">,
	"children"
> {
	description?: React.ReactNode
	placeholder?: string
	inputName?: string
	submitLabel?: string
}

export interface FooterStatusProps extends React.ComponentProps<"span"> {
	children?: React.ReactNode
}

export interface FooterProps extends React.ComponentProps<"footer"> {
	size?: FooterSize
	brand?: React.ReactNode
	description?: React.ReactNode
	status?: React.ReactNode | false
	localTime?: React.ReactNode | false
	columns?: FooterColumn[]
	/**
	 * Compatibility alias for the previous simple footer API. Prefer `columns`
	 * for new implementations.
	 */
	links?: FooterLink[]
	subscribe?: React.ReactNode | false
	credit?: React.ReactNode
	meta?: React.ReactNode
	attribution?: React.ReactNode
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

type ClassValue = string | false | null | undefined | ClassValue[]

function cn(...inputs: ClassValue[]) {
	const classes: string[] = []

	for (const input of inputs) {
		if (Array.isArray(input)) {
			const value = cn(...input)

			if (value) {
				classes.push(value)
			}
		} else if (input) {
			classes.push(input)
		}
	}

	return classes.join(" ")
}

function FooterStatus({
	children = "Open to work",
	className,
	...props
}: FooterStatusProps) {
	return (
		<span
			className={cn(
				"group/status inline-flex items-center gap-ml-2 rounded-full border border-accent bg-accent-soft px-ml-4 py-ml-2 font-mono text-(length:--ml-footer-status-text) font-semibold tracking-(--ml-footer-status-tracking) text-accent uppercase transition-[background-color,border-color,transform] duration-(--duration-micro) motion-safe:hover:-translate-y-px sm:text-(length:--ml-footer-status-text-tablet)",
				className
			)}
			{...props}
		>
			<span className="size-ml-1-5 shrink-0 rounded-full bg-accent transition-transform duration-(--duration-micro) group-hover/status:scale-(--ml-footer-status-dot-hover-scale)" />
			{children}
		</span>
	)
}

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

function FooterSubscribeForm({
	description = "One essay a month. No tracking, no nonsense.",
	placeholder = "you@studio.com",
	inputName = "email",
	submitLabel = "Subscribe",
	action = "#",
	method = "post",
	className,
	...props
}: FooterSubscribeFormProps) {
	return (
		<form
			action={action}
			method={method}
			className={cn("flex min-w-0 flex-col gap-ml-3", className)}
			{...props}
		>
			<p className="max-w-(--ml-footer-subscribe-copy-max) text-base leading-relaxed text-body">
				{description}
			</p>
			<div className="flex h-(--ml-footer-subscribe-control-height) w-full max-w-(--ml-footer-subscribe-control-max) overflow-hidden rounded-md border border-border-strong bg-card p-ml-1 transition-[border-color,box-shadow,transform] duration-(--duration-micro) focus-within:border-accent focus-within:shadow-(--focus-ring) motion-safe:hover:-translate-y-px">
				<input
					type="email"
					name={inputName}
					required
					placeholder={placeholder}
					aria-label="Email address"
					className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent px-ml-3 text-sm text-primary outline-none transition-colors duration-(--duration-micro) focus:placeholder:text-muted-foreground/70"
				/>
				<button
					type="submit"
					aria-label={submitLabel}
					className="group/submit inline-flex aspect-square h-full items-center justify-center rounded-sm bg-accent text-accent-foreground transition-transform duration-(--duration-micro) hover:scale-(--ml-footer-submit-hover-scale) active:scale-95 focus-visible:outline-none focus-visible:shadow-(--focus-ring)"
				>
					<span
						aria-hidden="true"
						className="transition-transform duration-(--duration-micro) group-hover/submit:translate-x-(--ml-footer-submit-arrow-hover-x)"
					>
						→
					</span>
				</button>
			</div>
		</form>
	)
}

function isExternalHref(link: FooterLink) {
	return link.external ?? /^(https?:|mailto:|tel:)/.test(link.href)
}

function FooterRoot({
	size = "md",
	brand = "Chitrank",
	description = "Technical Lead. Nine years bridging React, Node, and ML pipelines. Currently in Delhi, working on inference infra.",
	status = <FooterStatus />,
	localTime = "UTC+5:30 · 23:14 local",
	columns,
	links,
	subscribe,
	credit,
	meta,
	attribution = "Next 15 · Sanity · Tailwind 4",
	className,
	...props
}: FooterProps) {
	const sizeClasses = footerSizeClasses[size]
	const currentYear = new Date().getFullYear()
	const defaultMeta = (
		<>
			© {currentYear} · Built by Chitrank Agnihotri ·<br />
			<span className="text-primary">v3.2.0</span>
		</>
	)
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
						<div
							className={cn(
								"font-script leading-none font-bold text-primary",
								sizeClasses.brand
							)}
						>
							{brand}
						</div>
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
								{column.links.map((link) => {
									const external = isExternalHref(link)

									return (
										<a
											key={link.href}
											href={link.href}
											target={link.target ?? (external ? "_blank" : undefined)}
											rel={
												link.rel ??
												(external ? "noopener noreferrer" : undefined)
											}
											className={cn(
												"group/link inline-flex w-fit items-center leading-none text-body no-underline transition-[color,transform] duration-(--duration-micro) motion-safe:hover:translate-x-(--ml-footer-link-hover-x) hover:text-primary focus-visible:outline-none focus-visible:shadow-(--focus-ring)",
												sizeClasses.link
											)}
										>
											<span>{link.label}</span>
											{external ? (
												<span
													className="text-muted-foreground ml-ml-1 transition-transform duration-(--duration-micro) group-hover/link:translate-x-(--ml-footer-link-arrow-hover-x)"
													aria-hidden="true"
												>
													↗
												</span>
											) : null}
										</a>
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
						<p className="max-w-(--ml-footer-meta-copy-max)">
							{resolvedMeta}
						</p>
					) : null}
					{attribution ? <p>{attribution}</p> : null}
				</div>
			</div>
		</footer>
	)
}

const Footer = Object.assign(FooterRoot, {
	Status: FooterStatus,
	Subscribe: FooterSubscribeForm,
})

export { Footer }
