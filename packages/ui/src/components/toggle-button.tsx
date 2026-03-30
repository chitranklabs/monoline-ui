import type * as React from "react"

import { cn } from "../lib/utils"

export interface ToggleOption<T extends string> {
	value: T
	label: string
}

export interface ToggleButtonProps<T extends string>
	extends Omit<React.ComponentProps<"div">, "onChange"> {
	options: [ToggleOption<T>, ToggleOption<T>]
	activeValue: T
	onChange: (value: T) => void
}

function ToggleButton<T extends string>({
	options,
	activeValue,
	onChange,
	className,
	...props
}: ToggleButtonProps<T>) {
	const [option1] = options

	return (
		<div
			data-slot="toggle-button"
			className={cn(
				"relative inline-grid grid-cols-2 gap-0 rounded-2xl border border-border/80 bg-muted/60 p-1 backdrop-blur-md",
				className
			)}
			{...props}
		>
			<div
				className={cn(
					"absolute top-1 h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)] rounded-xl bg-card shadow-[var(--shadow-soft)] ring-1 ring-border/40 transition-all duration-300 ease-out",
					activeValue === option1.value ? "left-1" : "left-[calc(50%+0.125rem)]"
				)}
			/>

			{options.map((option) => (
				<button
					key={option.value}
					type="button"
					onClick={() => onChange(option.value)}
					className={cn(
						"relative z-10 flex h-9 items-center justify-center px-5 text-sm font-medium transition-colors duration-300",
						activeValue === option.value
							? "text-foreground"
							: "text-muted-foreground opacity-80 hover:opacity-100"
					)}
				>
					{option.label}
				</button>
			))}
		</div>
	)
}

export { ToggleButton }
