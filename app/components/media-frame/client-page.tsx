"use client"

import {
	MediaFrame,
	type MediaFrameRatio,
	type MediaFrameSize,
} from "@chitrank2050/monoline-ui/components/media-frame"

import { ComponentPlayground } from "../../_components/component-playground"

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
        sizes="(max-width: 768px) 100vw, 1200px"
      />
      <MediaFrame.Caption>COVER · PRODUCT</MediaFrame.Caption>
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
	["MediaFrame.Caption", "ReactNode", "Bottom-aligned media label with fade"],
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
	["--shadow-md", "Hover elevation"],
	["--duration-medium", "Media filter and caption fade timing"],
] as const

export default function MediaFramePageClient() {
	return (
		<ComponentPlayground<MediaFrameSize, MediaFrameRatio>
			title="MediaFrame"
			description="Reserve stable image, video, and custom media surfaces with monoline placeholder, caption, and grayscale hover behaviour."
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
						<MediaFrame.Caption>COVER · PRODUCT</MediaFrame.Caption>
					</MediaFrame>
				</div>
			)}
		/>
	)
}
