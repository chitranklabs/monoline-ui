/**
 * @module Footer
 * Description for Footer component.
 */
import { FooterLink } from "./link"
import { FooterRoot } from "./root"
import { FooterStatus } from "./status"
import { FooterSubscribeForm } from "./subscribe"

export * from "./types"

export const Footer: typeof FooterRoot & {
	displayName: string
	Status: typeof FooterStatus
	Subscribe: typeof FooterSubscribeForm
	Link: typeof FooterLink
} = Object.assign(FooterRoot, {
	displayName: "Footer",
	Status: FooterStatus,
	Subscribe: FooterSubscribeForm,
	Link: FooterLink,
})
