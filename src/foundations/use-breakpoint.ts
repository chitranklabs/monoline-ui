import { useEffect, useState } from "react"

import { type MonolineBreakpoint, monolineBreakpoints } from "./breakpoints"

export function useBreakpoint(
	defaultValue: MonolineBreakpoint = "desktop"
): MonolineBreakpoint {
	const [breakpoint, setBreakpoint] = useState<MonolineBreakpoint>(defaultValue)

	useEffect(() => {
		const getBreakpoint = (): MonolineBreakpoint => {
			if (typeof window === "undefined") return defaultValue
			const width = window.innerWidth
			if (width >= monolineBreakpoints.wide) return "wide"
			if (width >= monolineBreakpoints.desktop) return "desktop"
			if (width >= monolineBreakpoints.tabletMin) return "tablet"
			return "mobile"
		}

		const handleResize = () => {
			setBreakpoint(getBreakpoint())
		}

		// Calculate initial value on client mount
		handleResize()

		window.addEventListener("resize", handleResize)
		return () => {
			window.removeEventListener("resize", handleResize)
		}
	}, [defaultValue])

	return breakpoint
}
