import { ToastRoot } from "./root"

export * from "./types"

export const Toast = Object.assign(ToastRoot, {
	displayName: "Toast" as const,
})
