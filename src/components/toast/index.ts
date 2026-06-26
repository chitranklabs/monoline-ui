/**
 * @module Toast
 * Description for Toast component.
 */
import { ToastRoot } from "./root"

export * from "./types"

export const Toast: typeof ToastRoot & {
	displayName: string
} = Object.assign(ToastRoot, {
	displayName: "Toast" as const,
})
