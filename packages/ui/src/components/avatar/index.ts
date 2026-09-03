/**
 * @module Avatar
 * Description for Avatar component.
 */
import { AvatarImage } from "./image"
import { AvatarRoot } from "./root"

export * from "./types"

export const Avatar: typeof AvatarRoot & {
	displayName: string
	Image: typeof AvatarImage
} = Object.assign(AvatarRoot, {
	displayName: "Avatar",
	Image: AvatarImage,
})
