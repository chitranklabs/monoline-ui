"use client"

import { useEffect, useMemo, useState } from "react"

import { cn } from "../../lib/utils"
import type { ProgressProps, ProgressSize } from "./types"

const progressSizeClasses: Record<ProgressSize, string> = {
	sm: "h-px",
	md: "h-0.5",
	lg: "h-1",
}

function clampPercent(value: number) {
	return Math.max(0, Math.min(100, value))
}

function resolveProgress(value: number | null | undefined, max: number) {
	if (value == null) return null
	if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) return 0
	return clampPercent((value / max) * 100)
}

function getDocumentScrollProgress() {
	if (typeof document === "undefined") return 0

	const root = document.documentElement
	const body = document.body
	const scrollTop = root.scrollTop || body.scrollTop || 0
	const scrollHeight = Math.max(
		root.scrollHeight,
		body.scrollHeight,
		root.offsetHeight,
		body.offsetHeight
	)
	const clientHeight = root.clientHeight
	const available = Math.max(0, scrollHeight - clientHeight)

	if (available <= 0) return 0

	return clampPercent((scrollTop / available) * 100)
}

export function ProgressRoot({
	className,
	value = null,
	max = 100,
	size = "md",
	followScroll = false,
	ref,
	...props
}: ProgressProps): React.ReactElement {
	const [scrollValue, setScrollValue] = useState(0)

	useEffect(() => {
		if (!followScroll) return

		let frame = 0

		const update = () => {
			frame = 0
			setScrollValue(getDocumentScrollProgress())
		}

		const schedule = () => {
			if (frame) return
			frame = window.requestAnimationFrame(update)
		}

		update()
		window.addEventListener("scroll", schedule, { passive: true })
		window.addEventListener("resize", schedule)

		return () => {
			if (frame) {
				window.cancelAnimationFrame(frame)
			}
			window.removeEventListener("scroll", schedule)
			window.removeEventListener("resize", schedule)
		}
	}, [followScroll])

	const percentage = useMemo(
		() => (followScroll ? scrollValue : resolveProgress(value, max)),
		[followScroll, max, scrollValue, value]
	)

	const determinate = percentage != null

	return (
		<div
			ref={ref}
			role="progressbar"
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={determinate ? Math.round(percentage) : undefined}
			data-size={size}
			data-follow-scroll={followScroll || undefined}
			className={cn("ml-progress", progressSizeClasses[size], className)}
			{...props}
		>
			<span
				className={cn(
					"ml-progress__indicator",
					!determinate && "animate-progress-loop"
				)}
				style={
					determinate
						? { transform: `scaleX(${(percentage ?? 0) / 100})` }
						: undefined
				}
			/>
		</div>
	)
}
