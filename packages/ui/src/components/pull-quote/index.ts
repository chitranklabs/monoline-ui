/**
 * @module PullQuote
 * Description for PullQuote component.
 */
import { PullQuoteRoot } from "./root"

export * from "./types"

export const PullQuote: typeof PullQuoteRoot & {
	displayName: string
} = Object.assign(PullQuoteRoot, {
	displayName: "PullQuote" as const,
})
