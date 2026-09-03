/**
 * @module DataList
 * Description for DataList component.
 */
import { DataListItem } from "./item"
import { DataListRoot } from "./root"

export * from "./types"

export const DataList: typeof DataListRoot & {
	displayName: string
	Item: typeof DataListItem
} = Object.assign(DataListRoot, {
	displayName: "DataList",
	Item: DataListItem,
})
