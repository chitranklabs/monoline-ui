export type SegmentedControlVariant = "default" | "pill"
export type SegmentedControlSize = "sm" | "md" | "lg"

export interface SegmentedControlOption<T extends string> {
	value: T
	label: string
	badge?: number
}

export interface SegmentedControlProps<T extends string> {
	options: SegmentedControlOption<T>[]
	value: T
	onChange: (value: T) => void
	variant?: SegmentedControlVariant
	size?: SegmentedControlSize
	className?: string
}
