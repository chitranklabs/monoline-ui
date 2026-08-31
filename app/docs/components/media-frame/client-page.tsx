"use client"

import {
	MediaFrame,
	type MediaFrameRatio,
	type MediaFrameSize,
} from "@chitrank2050/monoline-ui/components/media-frame"

import { ComponentPlayground } from "../../../_components/component-playground"

const mediaFrameSizes: MediaFrameSize[] = ["sm", "md", "lg"]
const mediaFrameRatios: MediaFrameRatio[] = [
	"landscape",
	"wide",
	"cinematic",
	"square",
]

const usageCode = `<MediaFrame ratio="cinematic" size="md" placeholder>
  <MediaFrame.Caption>COVER · PRODUCT</MediaFrame.Caption>
</MediaFrame>`

const sourceSnippet = `import Image from "next/image"
import { MediaFrame } from "@chitrank2050/monoline-ui/components/media-frame"

export function ProjectCover() {
  return (
    <MediaFrame ratio="cinematic" size="lg">
      <Image
        src="/project-cover.jpg"
        alt="Lumen Insights dashboard"
        fill
        sizes="(max-width: 48rem) 100vw, 75rem"
      />
      <MediaFrame.Meta>COVER · PRODUCT</MediaFrame.Meta>
    </MediaFrame>
  )
}`

const propsRows = [
	[
		"ratio",
		'"square" | "portrait" | "landscape" | "wide" | "cinematic"',
		"Reserved media aspect ratio",
	],
	["size", "sm | md | lg", "Frame radius and caption spacing"],
	["placeholder", "boolean", "Render the built-in media placeholder"],
	["asChild", "boolean", "Render a custom root element through Radix Slot"],
	["MediaFrame.Caption", "ReactNode", "Bottom-aligned caption with fade"],
	["MediaFrame.Meta", "ReactNode", "Bottom-aligned media metadata with fade"],
	[
		"children",
		"ReactNode",
		"img, video, canvas, svg, Next/Image, or custom media",
	],
] as const

const tokenRows = [
	["--surface", "Frame background"],
	["--border", "Frame outline"],
	["--shadow-xs", "Resting elevation"],
	["--duration-medium", "Caption and meta fade timing"],
] as const

export default function MediaFramePageClient() {
	return (
		<ComponentPlayground<MediaFrameSize, MediaFrameRatio>
			title="MediaFrame"
			description="Reserve stable media surfaces for images, video, placeholders, captions, and metadata."
			sizes={mediaFrameSizes}
			defaultSize="md"
			variants={mediaFrameRatios}
			defaultVariant="cinematic"
			previewLayout="viewport"
			importStatement='import { MediaFrame } from "@chitrank2050/monoline-ui/components/media-frame"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(size = "md", _theme, ratio = "cinematic") => (
				<div className="grid w-full gap-ml-5 p-ml-6">
					<MediaFrame
						size={size}
						ratio={ratio}
						placeholder
						className="w-full max-w-250"
					>
						<MediaFrame.Meta>COVER · PRODUCT</MediaFrame.Meta>
					</MediaFrame>
				</div>
			)}
		/>
	)
}
