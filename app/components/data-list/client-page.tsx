"use client"

import {
	DataList,
	type DataListSize,
} from "@chitrank2050/monoline-ui/data-list"

import { ComponentPlayground } from "../../_components/component-playground"

const dataListSizes: DataListSize[] = ["sm", "md", "lg"]

const items = [
	{
		label: "01",
		title: "Nine years",
		description: "Frontend to lead to architect, hospitality tech to AI infra.",
	},
	{
		label: "02",
		title: "14 production",
		description: "Apps shipped end-to-end, mostly React, Node, and Postgres.",
	},
	{
		label: "03",
		title: "47k words",
		description: "Written long-form on engineering systems since 2023.",
		trailing: "Active",
	},
]

const propsRows = [
	["size", "sm | md | lg", "Row density and type scale"],
	["variant", "default | numbered", "Default rows or fixed label column"],
	["items", "DataListItemData[]", "Data-driven rows"],
	["children", "ReactNode", "Compound composition override"],
	["DataList.Item", "compound slot", "Manual row composition"],
] as const

const tokenRows = [
	["--ml-data-list-item-padding-y", "Vertical row rhythm"],
	["--ml-data-list-label-width", "Numbered label column width"],
	["--ml-data-list-title-text", "Title type scale"],
	["--border", "Row separators"],
] as const

const sourceSnippet = `import { DataList } from "@chitrank2050/monoline-ui/data-list"

export function ExperienceStats() {
  return (
    <DataList
      variant="numbered"
      items={[
        { label: "01", title: "Nine years", description: "Frontend to architect." },
        { label: "02", title: "14 production", description: "Apps shipped end-to-end." },
      ]}
    />
  )
}`

const usageCode = `<DataList
  variant="numbered"
  items={[
    { label: "01", title: "Nine years", description: "Frontend to architect." },
    { label: "02", title: "14 production", description: "Apps shipped end-to-end." },
  ]}
/>

<DataList>
  <DataList.Item label="01" title="Nine years" description="Frontend to architect." />
</DataList>`

export default function DataListPageClient() {
	return (
		<ComponentPlayground<DataListSize>
			title="DataList"
			description="Render token-backed rows for stats, timelines, metadata, and compact structured content without baking in a page layout."
			sizes={dataListSizes}
			defaultSize="md"
			importStatement='import { DataList } from "@chitrank2050/monoline-ui/data-list"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(size = "md") => (
				<div className="w-full max-w-3xl p-ml-6">
					<DataList size={size} variant="numbered" items={items} />
				</div>
			)}
		/>
	)
}
