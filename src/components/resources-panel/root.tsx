import { cn } from "../../lib/utils"
import type {
	ResourcesPanelItem,
	ResourcesPanelKind,
	ResourcesPanelProps,
} from "./types"

function isExternalHref(item: ResourcesPanelItem) {
	return item.external ?? /^(https?:|mailto:|tel:)/.test(item.href ?? "")
}

function getDefaultFooterLabel(count: number) {
	return `${count} total ${count === 1 ? "resource" : "resources"}`
}

function ResourceIcon({ kind = "external" }: { kind?: ResourcesPanelKind }) {
	return (
		<svg
			aria-hidden="true"
			className="ml-resources-panel__icon-svg"
			viewBox="0 0 16 16"
		>
			{kind === "live" ? (
				<>
					<path d="M3 8h9" />
					<path d="m9 5 3 3-3 3" />
				</>
			) : null}
			{kind === "source" ? (
				<>
					<path d="m6 5-3 3 3 3" />
					<path d="m10 5 3 3-3 3" />
				</>
			) : null}
			{kind === "npm" ? (
				<>
					<rect x="2.75" y="3" width="10.5" height="10" rx="1.25" />
					<path d="M6 10V6h4v4" />
					<path d="M8 10V6" />
				</>
			) : null}
			{kind === "docs" ? (
				<>
					<path d="M4 2.75h5.25L12 5.5v7.75H4z" />
					<path d="M9.25 2.75V5.5H12" />
					<path d="M6 8h4" />
					<path d="M6 10.25h4" />
				</>
			) : null}
			{kind === "changelog" ? (
				<>
					<path d="M5.25 4.5h7" />
					<path d="M5.25 8h7" />
					<path d="M5.25 11.5h5" />
					<path d="M3 4.5h.01" />
					<path d="M3 8h.01" />
					<path d="M3 11.5h.01" />
				</>
			) : null}
			{kind === "figma" ? (
				<>
					<path d="M5.5 2.75h2.75v3H5.5a1.5 1.5 0 0 1 0-3Z" />
					<path d="M8.25 2.75H11a1.5 1.5 0 0 1 0 3H8.25Z" />
					<path d="M5.5 5.75h2.75v3H5.5a1.5 1.5 0 0 1 0-3Z" />
					<path d="M8.25 5.75H11a1.5 1.5 0 1 1-1.5 1.5" />
					<path d="M5.5 8.75h2.75v1.5a1.5 1.5 0 1 1-1.5-1.5" />
				</>
			) : null}
			{kind === "video" ? (
				<>
					<rect x="2.75" y="4" width="10.5" height="8" rx="1.25" />
					<path d="m7 6.5 3 1.5-3 1.5z" />
				</>
			) : null}
			{kind === "paper" ? (
				<>
					<path d="M4.25 2.75h5.5l2 2v8.5h-7.5z" />
					<path d="M6.25 7h3.5" />
					<path d="M6.25 9.25h3.5" />
					<path d="M6.25 11.5h2.5" />
				</>
			) : null}
			{kind === "external" ? (
				<>
					<circle cx="8" cy="8" r="4.75" />
					<path d="M8 5.25v5.5" />
					<path d="M5.25 8h5.5" />
				</>
			) : null}
		</svg>
	)
}

export function ResourcesPanelRoot({
	className,
	size = "md",
	title,
	meta,
	items,
	footer,
	footerLabel,
	children,
	linkComponent,
	...props
}: ResourcesPanelProps) {
	const resolvedFooter =
		footer === null
			? null
			: (footer ?? footerLabel ?? getDefaultFooterLabel(items.length))
	const resolvedTitle = title ?? "Resources"

	return (
		<aside
			data-slot="resources-panel"
			data-size={size}
			className={cn("ml-resources-panel", className)}
			{...props}
		>
			<header className="ml-resources-panel__header">
				<span className="ml-resources-panel__title">{resolvedTitle}</span>
				{meta ? <span className="ml-resources-panel__meta">{meta}</span> : null}
			</header>
			{children ?? (
				<ul className="ml-resources-panel__list">
					{items.map((item, index) => {
						const external = isExternalHref(item)
						const LinkComp = item.as ?? linkComponent ?? "a"
						const key =
							typeof item.label === "string"
								? `${item.label}-${index}`
								: `${item.href ?? item.kind ?? "resource"}-${index}`
						const content = (
							<>
								<span
									className="ml-resources-panel__icon"
									data-primary={item.primary || undefined}
								>
									{item.icon ?? <ResourceIcon kind={item.kind} />}
								</span>
								<span className="ml-resources-panel__content">
									<span className="ml-resources-panel__label">
										{item.label}
										{item.badge ? (
											<span className="ml-resources-panel__badge">
												{item.badge}
											</span>
										) : null}
									</span>
									{item.host || item.meta ? (
										<span className="ml-resources-panel__host">
											{item.host}
											{item.host && item.meta ? " · " : null}
											{item.meta}
										</span>
									) : null}
								</span>
								{item.href ? (
									<span
										className="ml-resources-panel__arrow"
										aria-hidden="true"
									>
										↗
									</span>
								) : null}
							</>
						)

						return (
							<li key={key} className="ml-resources-panel__row">
								{item.href ? (
									<LinkComp
										href={item.href}
										target={item.target ?? (external ? "_blank" : undefined)}
										rel={
											item.rel ?? (external ? "noopener noreferrer" : undefined)
										}
										className="ml-resources-panel__item"
										data-primary={item.primary || undefined}
									>
										{content}
									</LinkComp>
								) : (
									<div
										className="ml-resources-panel__item"
										data-primary={item.primary || undefined}
										data-disabled="true"
									>
										{content}
									</div>
								)}
							</li>
						)
					})}
				</ul>
			)}
			{resolvedFooter ? (
				<footer className="ml-resources-panel__footer">{resolvedFooter}</footer>
			) : null}
		</aside>
	)
}
