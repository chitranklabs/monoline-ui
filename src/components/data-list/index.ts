import { DataListItem } from "./item"
import { DataListRoot } from "./root"

export * from "./types"

export const DataList = Object.assign(DataListRoot, {
	Item: DataListItem,
})
