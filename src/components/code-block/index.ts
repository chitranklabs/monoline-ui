/**
 * @module CodeBlock
 * Description for CodeBlock component.
 */
import { CodeBlockRoot } from "./root"

export * from "./types"

export const CodeBlock: typeof CodeBlockRoot & {
	displayName: string
} = Object.assign(CodeBlockRoot, {
	displayName: "CodeBlock" as const,
})
