import { MediaFrameCaption } from "./caption"
import { MediaFrameRoot } from "./root"

export * from "./types"

export const MediaFrame = Object.assign(MediaFrameRoot, {
	Caption: MediaFrameCaption,
})

export { MediaFrameCaption, MediaFrameRoot }
