import { NavbarActions } from "./actions"
import { NavbarBrand } from "./brand"
import { NavbarLink } from "./link"
import { NavbarNav } from "./nav"
import { NavbarRoot } from "./root"

export * from "./types"

export const Navbar = Object.assign(NavbarRoot, {
	Actions: NavbarActions,
	Brand: NavbarBrand,
	Link: NavbarLink,
	Nav: NavbarNav,
})
