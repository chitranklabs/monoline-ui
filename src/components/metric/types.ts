import type * as React from "react"

export type MetricTrend = "up" | "down" | "flat"
export type MetricSize = "sm" | "md" | "lg"

export interface MetricProps extends React.ComponentPropsWithoutRef<"div"> {
	value: React.ReactNode
	label: React.ReactNode
	description?: React.ReactNode
	trend?: MetricTrend
	size?: MetricSize
}
