import { CodeBlockRoot } from "./root"

export * from "./types"

export const CodeBlock = Object.assign(CodeBlockRoot, {
	displayName: "CodeBlock" as const,
})
