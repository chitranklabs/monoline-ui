/**
 * @module ActionRail
 * Description for ActionRail component.
 */
import { ActionRailRoot } from "./root"

export * from "./types"

export const ActionRail: typeof ActionRailRoot & {
	displayName: string
} = Object.assign(ActionRailRoot, {
	displayName: "ActionRail" as const,
})
