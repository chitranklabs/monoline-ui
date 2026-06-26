/**
 * @module Skeleton
 * Description for Skeleton component.
 */
import { SkeletonRoot } from "./root"

export * from "./types"

export const Skeleton: typeof SkeletonRoot & {
	displayName: string
} = Object.assign(SkeletonRoot, {
	displayName: "Skeleton" as const,
})
