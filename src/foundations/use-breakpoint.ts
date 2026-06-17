import { useEffect, useRef, useState } from "react"

import { type MonolineBreakpoint, monolineBreakpoints } from "./breakpoints"

function resolveBreakpoint(width: number): MonolineBreakpoint {
	if (width >= monolineBreakpoints.wide) return "wide"
	if (width >= monolineBreakpoints.desktop) return "desktop"
	if (width >= monolineBreakpoints.tabletMin) return "tablet"
	return "mobile"
}

export function useBreakpoint(
	defaultValue: MonolineBreakpoint = "desktop"
): MonolineBreakpoint {
	const [breakpoint, setBreakpoint] = useState<MonolineBreakpoint>(defaultValue)
	const frameRef = useRef(0)

	useEffect(() => {
		if (typeof window === "undefined") return

		setBreakpoint(resolveBreakpoint(window.innerWidth))

		const handleResize = () => {
			if (frameRef.current) return
			frameRef.current = window.requestAnimationFrame(() => {
				frameRef.current = 0
				setBreakpoint(resolveBreakpoint(window.innerWidth))
			})
		}

		window.addEventListener("resize", handleResize, { passive: true })
		return () => {
			if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
			window.removeEventListener("resize", handleResize)
		}
	}, [])

	return breakpoint
}
