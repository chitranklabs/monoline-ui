import "./command-search.css"
import { CommandSearchEmpty } from "./empty"
import { CommandSearchFooter } from "./footer"
import { CommandSearchGroup } from "./group"
import { CommandSearchInput } from "./input"
import { CommandSearchItem } from "./item"
import { CommandSearchList } from "./list"
import { CommandSearchRoot } from "./root"

export * from "./types"

export const CommandSearch = Object.assign(CommandSearchRoot, {
	displayName: "CommandSearch" as const,
	Input: CommandSearchInput,
	List: CommandSearchList,
	Item: CommandSearchItem,
	Empty: CommandSearchEmpty,
	Group: CommandSearchGroup,
	Footer: CommandSearchFooter,
})
