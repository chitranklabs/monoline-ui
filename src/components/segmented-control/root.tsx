"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import type { SegmentedControlProps } from "./types"

export function SegmentedControlRoot<T extends string>({
	options,
	value,
	onChange,
	variant = "default",
	size = "md",
	className,
}: SegmentedControlProps<T>) {
	const containerRef = React.useRef<HTMLDivElement>(null)
	const indicatorRef = React.useRef<HTMLDivElement>(null)
	const previousMetricsRef = React.useRef({ left: 0, width: 0 })

	React.useLayoutEffect(() => {
		const container = containerRef.current
		const indicator = indicatorRef.current
		const targetWindow = container?.ownerDocument.defaultView
		if (!container || !indicator || !targetWindow) return

		const updatePosition = (animate: boolean) => {
			const activeBtn = container.querySelector(
				'[role="radio"][aria-checked="true"]'
			) as HTMLButtonElement | null
			if (!activeBtn) {
				indicator.style.opacity = "0"
				return
			}

			const nextMetrics = {
				left: activeBtn.offsetLeft,
				width: activeBtn.offsetWidth,
			}
			const previousMetrics = previousMetricsRef.current

			indicator.style.left = `${nextMetrics.left}px`
			indicator.style.width = `${nextMetrics.width}px`
			indicator.style.opacity = "1"
			indicator.getAnimations().forEach((animation) => animation.cancel())

			const shouldAnimate =
				animate &&
				previousMetrics.width > 0 &&
				!targetWindow.matchMedia("(prefers-reduced-motion: reduce)").matches

			if (shouldAnimate) {
				indicator.animate(
					[
						{
							transform: `translate3d(${
								previousMetrics.left - nextMetrics.left
							}px, 0, 0) scaleX(${previousMetrics.width / nextMetrics.width})`,
						},
						{ transform: "translate3d(0, 0, 0) scaleX(1)" },
					],
					{
						duration: 180,
						easing: "cubic-bezier(0.16, 1, 0.3, 1)",
					}
				)
			}

			previousMetricsRef.current = nextMetrics
		}

		updatePosition(true)
		const resizeObserver = new ResizeObserver(() => updatePosition(false))
		resizeObserver.observe(container)

		return () => {
			resizeObserver.disconnect()
		}
	}, [value, options])

	return (
		<div
			ref={containerRef}
			role="radiogroup"
			className={cn(
				"ml-segmented",
				`ml-segmented--${size}`,
				variant === "pill" && "ml-segmented--pill",
				className
			)}
		>
			<div
				ref={indicatorRef}
				aria-hidden="true"
				className="ml-segmented__indicator"
			/>
			{options.map((option) => (
				<button
					key={option.value}
					type="button"
					role="radio"
					aria-checked={value === option.value}
					disabled={option.disabled}
					onClick={() => onChange(option.value)}
					className="ml-segmented__item"
				>
					<span className="ml-segmented__label">{option.label}</span>
					{option.badge !== undefined && (
						<span className="ml-segmented__badge">{option.badge}</span>
					)}
				</button>
			))}
		</div>
	)
}
