export type SegmentedControlVariant = "default" | "pill"

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
	className?: string
}
