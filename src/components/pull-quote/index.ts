import { PullQuoteRoot } from "./root"

export * from "./types"

export const PullQuote = Object.assign(PullQuoteRoot, {
	displayName: "PullQuote" as const,
})
