import { TocRoot } from "./root"

export * from "./types"

export const Toc = Object.assign(TocRoot, {
	displayName: "Toc" as const,
})
