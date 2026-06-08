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
	const [indicatorStyle, setIndicatorStyle] =
		React.useState<React.CSSProperties>({
			transform: "translateX(0)",
			width: 0,
			opacity: 0,
		})

	React.useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const updatePosition = () => {
			const activeBtn = container.querySelector(
				'[role="radio"][aria-checked="true"]'
			) as HTMLButtonElement | null
			if (activeBtn) {
				setIndicatorStyle({
					transform: `translateX(${activeBtn.offsetLeft}px)`,
					width: activeBtn.offsetWidth,
					opacity: 1,
				})
			} else {
				setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }))
			}
		}

		updatePosition()
		const raf = requestAnimationFrame(updatePosition)
		window.addEventListener("resize", updatePosition)
		return () => {
			cancelAnimationFrame(raf)
			window.removeEventListener("resize", updatePosition)
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
				aria-hidden="true"
				className="ml-segmented__indicator"
				style={indicatorStyle}
			/>
			{options.map((option) => (
				<button
					key={option.value}
					type="button"
					role="radio"
					aria-checked={value === option.value}
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
