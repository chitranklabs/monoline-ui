/**
 * @module EditorialLine
 * Description for EditorialLine component.
 */
import { EditorialLineRoot } from "./root"

export * from "./types"

export const EditorialLine: typeof EditorialLineRoot & {
	displayName: string
} = Object.assign(EditorialLineRoot, {
	displayName: "EditorialLine" as const,
})
