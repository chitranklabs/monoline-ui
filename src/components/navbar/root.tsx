import { cn } from "../../lib/utils"
import { NavbarActions } from "./actions"
import { NavbarBrand } from "./brand"
import { NavbarNav } from "./nav"
import type { NavbarLinkItem, NavbarProps } from "./types"

function isExternalHref(link: NavbarLinkItem) {
	return link.external ?? /^(https?:|mailto:|tel:)/.test(link.href)
}

export function NavbarRoot({
	size = "md",
	brand,
	links,
	actions,
	children,
	navLabel = "Primary navigation",
	linkComponent,
	sticky = false,
	glass = false,
	className,
	...props
}: NavbarProps) {
	return (
		<header
			data-slot="navbar"
			data-size={size}
			className={cn(
				"ml-navbar",
				sticky && "ml-navbar--sticky",
				glass && "ml-navbar--glass",
				className
			)}
			{...props}
		>
			<div className="ml-navbar__container">
				{children ? (
					children
				) : (
					<>
						{brand ? (
							<NavbarBrand href="/" mark={<span />}>
								{brand}
							</NavbarBrand>
						) : null}
						{links?.length ? (
							<NavbarNav label={navLabel}>
								{links.map((link, index) => {
									const external = isExternalHref(link)
									const LinkComp = link.as ?? linkComponent ?? "a"

									return (
										<LinkComp
											key={`${link.href}-${index}`}
											href={link.href}
											aria-current={link.active ? "page" : undefined}
											data-active={link.active || undefined}
											target={link.target ?? (external ? "_blank" : undefined)}
											rel={
												link.rel ??
												(external ? "noopener noreferrer" : undefined)
											}
											className="ml-navbar__link"
										>
											<span>{link.label}</span>
											{external ? (
												<span
													className="ml-navbar__link-arrow"
													aria-hidden="true"
												>
													↗
												</span>
											) : null}
										</LinkComp>
									)
								})}
							</NavbarNav>
						) : null}
						{actions ? <NavbarActions>{actions}</NavbarActions> : null}
					</>
				)}
			</div>
		</header>
	)
}
