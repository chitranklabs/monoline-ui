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
	ref,
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
	const activeIndex = options.findIndex((opt) => opt.value === value)
	const firstEnabledIndex = options.findIndex((opt) => !opt.disabled)
	const defaultTabIndexIndex =
		activeIndex >= 0
			? activeIndex
			: firstEnabledIndex >= 0
				? firstEnabledIndex
				: 0

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (
			e.key !== "ArrowRight" &&
			e.key !== "ArrowLeft" &&
			e.key !== "ArrowDown" &&
			e.key !== "ArrowUp"
		) {
			return
		}

		e.preventDefault()

		const container = containerRef.current
		if (!container) return

		const buttons = Array.from(
			container.querySelectorAll('[role="radio"]:not(:disabled)')
		) as HTMLButtonElement[]

		if (buttons.length <= 1) return

		const activeElement = container.ownerDocument
			.activeElement as HTMLButtonElement | null
		if (!activeElement) return

		const currentIndex = buttons.indexOf(activeElement)
		if (currentIndex === -1) return

		let nextIndex = currentIndex
		if (e.key === "ArrowRight" || e.key === "ArrowDown") {
			nextIndex = (currentIndex + 1) % buttons.length
		} else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
			nextIndex = (currentIndex - 1 + buttons.length) % buttons.length
		}

		const nextButton = buttons[nextIndex]
		if (nextButton) {
			nextButton.focus()
			const optionVal = options.find(
				(opt) => opt.value === nextButton.getAttribute("data-value")
			)
			if (optionVal) {
				onChange(optionVal.value)
			}
		}
	}

	return (
		// eslint-disable-next-line jsx-a11y/interactive-supports-focus -- roving tabindex on child radio buttons
		<div
			ref={(node) => {
				containerRef.current = node
				if (typeof ref === "function") ref(node)
				else if (ref) ref.current = node
			}}
			role="radiogroup"
			onKeyDown={handleKeyDown}
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
			{options.map((option, idx) => (
				<button
					key={option.value}
					type="button"
					role="radio"
					aria-checked={value === option.value}
					tabIndex={idx === defaultTabIndexIndex ? 0 : -1}
					data-value={option.value}
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
