"use client"

import { Badge, type BadgeSize } from "@chitrank2050/monoline-ui/badge"

import { ComponentPlayground } from "../../../_components/component-playground"

const badgeSizes: BadgeSize[] = ["xs", "sm", "md"]

const usageCode = `<Badge variant="outline" size="sm">Outline</Badge>
<Badge variant="solid" size="sm">Solid</Badge>
<Badge variant="muted" size="sm">Muted</Badge>
<Badge variant="accent" size="sm">Accent</Badge>`

const sourceSnippet = `import { Badge } from "@chitrank2050/monoline-ui/badge"

export function Badges() {
  return (
    <div className="flex gap-2">
      <Badge variant="solid">Active</Badge>
      <Badge variant="outline">Draft</Badge>
      <Badge variant="muted">Archived</Badge>
    </div>
  )
}`

const propsRows = [
	["variant", "outline | solid | muted | accent", "Visual intent variation"],
	["size", "xs | sm | md", "Scale variation"],
	["asChild", "boolean", "Radix slot composition support"],
] as const

const tokenRows = [
	["--radius-pill", "Fully rounded outline pill shape"],
] as const

export default function BadgePageClient() {
	return (
		<ComponentPlayground<BadgeSize>
			title="Badge"
			description="Label counts, statuses, and categories with compact size and variant controls."
			sizes={badgeSizes}
			defaultSize="sm"
			importStatement='import { Badge } from "@chitrank2050/monoline-ui/badge"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(size = "sm") => (
				<div className="grid gap-ml-5 p-ml-6">
					<div className="flex flex-wrap items-center gap-ml-3">
						<Badge variant="outline" size={size}>
							Outline
						</Badge>
						<Badge variant="solid" size={size}>
							Solid
						</Badge>
						<Badge variant="muted" size={size}>
							Muted
						</Badge>
						<Badge variant="accent" size={size}>
							Accent
						</Badge>
					</div>
				</div>
			)}
		/>
	)
}
