import { MediaFrameCaption } from "./caption"
import "./media-frame.css"
import { MediaFrameMeta } from "./meta"
import { MediaFrameRoot } from "./root"

export * from "./types"

export const MediaFrame = Object.assign(MediaFrameRoot, {
	Caption: MediaFrameCaption,
	Meta: MediaFrameMeta,
})

export { MediaFrameCaption, MediaFrameMeta, MediaFrameRoot }
