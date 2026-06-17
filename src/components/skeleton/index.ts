import { SkeletonRoot } from "./root"
import "./skeleton.css"

export * from "./types"

export const Skeleton = Object.assign(SkeletonRoot, {
	displayName: "Skeleton" as const,
})
