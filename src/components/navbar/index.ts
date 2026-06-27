/**
 * @module Navbar
 * Description for Navbar component.
 */
import { NavbarActions } from "./actions"
import { NavbarBrand } from "./brand"
import { NavbarLink } from "./link"
import { NavbarNav } from "./nav"
import { NavbarRoot } from "./root"

export * from "./types"

export const Navbar: typeof NavbarRoot & {
	displayName: string
	Actions: typeof NavbarActions
	Brand: typeof NavbarBrand
	Link: typeof NavbarLink
	Nav: typeof NavbarNav
} = Object.assign(NavbarRoot, {
	displayName: "Navbar",
	Actions: NavbarActions,
	Brand: NavbarBrand,
	Link: NavbarLink,
	Nav: NavbarNav,
})
