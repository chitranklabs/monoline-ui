import "./avatar.css"
import { AvatarImage } from "./image"
import { AvatarRoot } from "./root"

export * from "./types"

export const Avatar = Object.assign(AvatarRoot, {
	displayName: "Avatar",
	Image: AvatarImage,
})
