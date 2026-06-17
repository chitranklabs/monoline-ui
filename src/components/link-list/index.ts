import { LinkListItem } from "./item"
import "./link-list.css"
import { LinkListRoot } from "./root"

export const LinkList = Object.assign(LinkListRoot, {
	Item: LinkListItem,
})

export { LinkListItem, LinkListRoot }
export type * from "./types"
