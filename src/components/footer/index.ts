import "./footer.css"
import { FooterLink } from "./link"
import { FooterRoot } from "./root"
import { FooterStatus } from "./status"
import { FooterSubscribeForm } from "./subscribe"

export * from "./types"

export const Footer = Object.assign(FooterRoot, {
	displayName: "Footer",
	Status: FooterStatus,
	Subscribe: FooterSubscribeForm,
	Link: FooterLink,
})
