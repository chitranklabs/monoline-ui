"use client"

import {
	LinkList,
	type LinkListSize,
} from "@chitrank2050/monoline-ui/link-list"

import { ComponentPlayground } from "../../_components/component-playground"

const linkListSizes: LinkListSize[] = ["sm", "md", "lg"]

const essays = [
	{
		label: "01",
		date: "May 12, 2026",
		title: "Designing a type-safe BFF with tRPC and Zod",
		href: "/components/command-search",
		tag: "Engineering",
		meta: "9m →",
	},
	{
		label: "02",
		date: "Apr 28, 2026",
		title: "Streaming LLM responses without losing your mind",
		href: "/components/progress",
		tag: "AI",
		meta: "12m →",
	},
	{
		label: "03",
		date: "Apr 14, 2026",
		title: "A pragmatic guide to React Server Components",
		href: "/installation",
		tag: "Frontend",
		meta: "8m →",
	},
	{
		label: "04",
		date: "Feb 19, 2026",
		title: "Postgres tricks I wish I knew at twenty-two",
		href: "/foundations/spacing",
		tag: "Backend",
		meta: "11m →",
	},
] as const

const propsRows = [
	["size", "sm | md | lg", "List density and row type scale"],
	["title", "ReactNode", "Exact header label"],
	["action", "ReactNode", "Header action such as All essays"],
	["items", "LinkListItem[]", "Dynamic link rows"],
	["children", "ReactNode", "Compound composition override"],
	["linkComponent", "ComponentType", "Next Link or router link adapter"],
] as const

const tokenRows = [
	["--ml-link-list-row-padding-y", "Vertical row rhythm"],
	["--ml-link-list-label-width", "Leading number column"],
	["--ml-link-list-date-width", "Desktop date column"],
	["--ml-link-list-title-text", "Title type scale"],
	["--border", "Header and row separators"],
] as const

const sourceSnippet = `import { LinkList } from "@chitrank2050/monoline-ui/link-list"

export function FurtherReading({ essays }) {
  const visibleEssays = essays.slice(0, 4)

  return (
    <LinkList
      title="Further reading"
      action={essays.length > 4 ? <a href="/writing">All essays</a> : null}
      items={visibleEssays}
    />
  )
}`

const usageCode = `<LinkList
  title="Further reading"
  action={<a href="/writing">All essays</a>}
  items={[
    {
      label: "01",
      date: "May 12, 2026",
      title: "Designing a type-safe BFF with tRPC and Zod",
      href: "/writing/type-safe-bff",
      tag: "Engineering",
      meta: "9m →",
    },
  ]}
/>`

export default function LinkListPageClient() {
	return (
		<ComponentPlayground<LinkListSize>
			title="LinkList"
			description="Render compact resource and reading-list rows with dates, descriptions, and external-link handling."
			sizes={linkListSizes}
			defaultSize="md"
			importStatement='import { LinkList } from "@chitrank2050/monoline-ui/link-list"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			previewLayout="viewport"
			renderPreview={(size = "md") => (
				<div className="w-full max-w-5xl p-ml-6">
					<LinkList
						size={size}
						title="Further reading"
						action={<a href="/components">All components</a>}
						items={[...essays]}
					/>
				</div>
			)}
		/>
	)
}
