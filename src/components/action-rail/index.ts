import { ActionRailRoot } from "./root"

export * from "./types"

export const ActionRail = Object.assign(ActionRailRoot, {
	displayName: "ActionRail" as const,
})
