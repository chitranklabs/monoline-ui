/**
 * @module CommandSearch
 * Description for CommandSearch component.
 */
import { CommandSearchEmpty } from "./empty"
import { CommandSearchFooter } from "./footer"
import { CommandSearchGroup } from "./group"
import { CommandSearchInput } from "./input"
import { CommandSearchItem } from "./item"
import { CommandSearchList } from "./list"
import { CommandSearchRoot } from "./root"

export * from "./types"

export const CommandSearch: typeof CommandSearchRoot & {
	displayName: string
	Input: typeof CommandSearchInput
	List: typeof CommandSearchList
	Item: typeof CommandSearchItem
	Empty: typeof CommandSearchEmpty
	Group: typeof CommandSearchGroup
	Footer: typeof CommandSearchFooter
} = Object.assign(CommandSearchRoot, {
	displayName: "CommandSearch" as const,
	Input: CommandSearchInput,
	List: CommandSearchList,
	Item: CommandSearchItem,
	Empty: CommandSearchEmpty,
	Group: CommandSearchGroup,
	Footer: CommandSearchFooter,
})
