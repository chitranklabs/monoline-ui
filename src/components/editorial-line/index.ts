import { EditorialLineRoot } from "./root"

export * from "./types"

export const EditorialLine = Object.assign(EditorialLineRoot, {
	displayName: "EditorialLine" as const,
})
