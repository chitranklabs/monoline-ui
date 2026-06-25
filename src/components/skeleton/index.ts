import { SkeletonRoot } from "./root"

export * from "./types"

export const Skeleton = Object.assign(SkeletonRoot, {
	displayName: "Skeleton" as const,
})
