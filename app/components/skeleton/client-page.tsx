"use client"

import {
	Skeleton,
	type SkeletonVariant,
} from "@chitrank2050/monoline-ui/skeleton"

import { ComponentPlayground } from "../../_components/component-playground"

const skeletonVariants: SkeletonVariant[] = ["rect", "pill", "circle"]

const usageCode = `<Skeleton variant="rect" className="h-6 w-32" />
<Skeleton variant="pill" className="h-4 w-48" />
<Skeleton variant="circle" className="size-12" />`

const sourceSnippet = `import { Skeleton } from "@chitrank2050/monoline-ui/skeleton"

export function SkeletonDemo() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton variant="circle" className="size-12" />
      <div className="flex flex-col gap-2">
        <Skeleton variant="rect" className="h-4 w-28" />
        <Skeleton variant="pill" className="h-3 w-40" />
      </div>
    </div>
  )
}`

const propsRows = [
	["variant", "rect | pill | circle", "Visual style / shape of the skeleton"],
] as const

const tokenRows = [
	["animate-shimmer / @keyframes shimmer", "Loading animation styling"],
] as const

export default function SkeletonPageClient() {
	return (
		<ComponentPlayground<SkeletonVariant>
			title="Skeleton"
			description="Display a placeholder preview (shimmering state) while content is loading."
			sizes={skeletonVariants}
			defaultSize="rect"
			importStatement='import { Skeleton } from "@chitrank2050/monoline-ui/skeleton"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(variant = "rect") => (
				<div className="grid gap-ml-5 p-ml-6">
					<div className="flex flex-col gap-ml-4">
						{variant === "rect" && (
							<Skeleton variant="rect" className="h-ml-12 w-ml-28" />
						)}
						{variant === "pill" && (
							<Skeleton variant="pill" className="h-ml-6 w-ml-40" />
						)}
						{variant === "circle" && (
							<Skeleton variant="circle" className="size-ml-16" />
						)}
					</div>
				</div>
			)}
		/>
	)
}
