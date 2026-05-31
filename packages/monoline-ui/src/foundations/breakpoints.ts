export const monolineBreakpoints = {
	mobile: 390,
	mobileMax: 767,
	tablet: 834,
	tabletMin: 768,
	tabletMax: 1023,
	desktop: 1280,
	wide: 1536,
} as const

export type MonolineBreakpoint = keyof typeof monolineBreakpoints
