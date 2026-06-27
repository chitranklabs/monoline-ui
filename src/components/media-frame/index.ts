/**
 * @module MediaFrame
 * Description for MediaFrame component.
 */
import { MediaFrameCaption } from "./caption"
import { MediaFrameMeta } from "./meta"
import { MediaFrameRoot } from "./root"

export * from "./types"

export const MediaFrame: typeof MediaFrameRoot & {
	displayName: string
	Caption: typeof MediaFrameCaption
	Meta: typeof MediaFrameMeta
} = Object.assign(MediaFrameRoot, {
	displayName: "MediaFrame",
	Caption: MediaFrameCaption,
	Meta: MediaFrameMeta,
})

export { MediaFrameCaption, MediaFrameMeta, MediaFrameRoot }
