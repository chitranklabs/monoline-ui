/**
 * @module LinkList
 * Description for LinkList component.
 */
import { LinkListItem } from "./item"
import { LinkListRoot } from "./root"

export const LinkList: typeof LinkListRoot & {
	displayName: string
	Item: typeof LinkListItem
} = Object.assign(LinkListRoot, {
	displayName: "LinkList",
	Item: LinkListItem,
})

export { LinkListItem, LinkListRoot }
export type * from "./types"
