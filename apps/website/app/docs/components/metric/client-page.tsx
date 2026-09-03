"use client"

import { Metric, type MetricSize } from "@chitrank2050/monoline-ui/metric"

import { ComponentPlayground } from "../../../_components/component-playground"

const metricSizes: MetricSize[] = ["sm", "md", "lg"]

const usageCode = `<Metric
  size="md"
  value="14"
  label="Production apps"
  description="Shipped across portfolio, docs, and internal tools."
  trend="up"
/>`

const sourceSnippet = `import { Metric } from "@chitrank2050/monoline-ui/metric"

export function Stats() {
  return (
    <Metric
      value="9"
      label="Years"
      description="React, Node, and ML infrastructure."
    />
  )
}`

const propsRows = [
	["size", "sm | md | lg", "Metric scale"],
	["value", "ReactNode", "Primary numeric or short value"],
	["label", "ReactNode", "Uppercase metric label"],
	["description", "ReactNode?", "Supporting copy"],
	["trend", "up | down | flat", "Optional trend glyph"],
] as const

const tokenRows = [
	["--surface", "Metric background"],
	["--border", "Metric outline"],
	["--callout-tip-accent", "Positive trend colour"],
] as const

export default function MetricPageClient() {
	return (
		<ComponentPlayground<MetricSize>
			title="Metric"
			description="Show key numbers with labels, descriptions, and optional trend state."
			sizes={metricSizes}
			defaultSize="md"
			importStatement='import { Metric } from "@chitrank2050/monoline-ui/metric"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(size = "md") => (
				<div className="grid gap-ml-4 p-ml-6 sm:grid-cols-3">
					<Metric
						size={size}
						value="9"
						label="Years"
						description="React, Node, and ML infrastructure."
					/>
					<Metric
						size={size}
						value="14"
						label="Projects"
						description="Production surfaces and internal systems."
						trend="up"
					/>
					<Metric
						size={size}
						value="2"
						label="Themes"
						description="One variable name across modes."
						trend="flat"
					/>
				</div>
			)}
		/>
	)
}
