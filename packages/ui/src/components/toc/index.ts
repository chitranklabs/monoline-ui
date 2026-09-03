/**
 * @module Toc
 * Description for Toc component.
 */
import { TocRoot } from "./root"

export * from "./types"

export const Toc: typeof TocRoot & {
	displayName: string
} = Object.assign(TocRoot, {
	displayName: "Toc" as const,
})
