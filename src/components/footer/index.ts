import { FooterRoot } from "./root"
import { FooterStatus } from "./status"
import { FooterSubscribeForm } from "./subscribe"
import { FooterLink } from "./link"

export * from "./types"

export const Footer = Object.assign(FooterRoot, {
	Status: FooterStatus,
	Subscribe: FooterSubscribeForm,
	Link: FooterLink,
})
