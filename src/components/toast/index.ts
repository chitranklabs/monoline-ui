import { ToastRoot } from "./root"
import "./toast.css"

export * from "./types"

export const Toast = Object.assign(ToastRoot, {
	displayName: "Toast" as const,
})
