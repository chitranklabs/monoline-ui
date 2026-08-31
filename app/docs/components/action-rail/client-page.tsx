"use client"

import { ActionRail } from "@chitrank2050/monoline-ui/action-rail"
import { Button } from "@chitrank2050/monoline-ui/button"

import { ComponentPlayground } from "../../../_components/component-playground"

const usageCode = `<ActionRail orientation="vertical">
  <Button variant="ghost" icon>🐦</Button>
  <Button variant="ghost" icon>🐙</Button>
  <Button variant="ghost" icon>💼</Button>
</ActionRail>`

const sourceSnippet = `import { ActionRail } from "@chitrank2050/monoline-ui/action-rail"
import { Button } from "@chitrank2050/monoline-ui/button"

export function Toolbar() {
  return (
    <ActionRail orientation="horizontal">
      <Button variant="secondary">Back</Button>
      <Button>Save</Button>
    </ActionRail>
  )
}`

const propsRows = [
	["orientation", "vertical | horizontal", "Flow direction layout"],
] as const

const tokenRows = [] as const

export default function ActionRailPageClient() {
	return (
		<ComponentPlayground
			title="ActionRail"
			description="Group compact actions vertically or horizontally for toolbars, side rails, and social links."
			importStatement='import { ActionRail } from "@chitrank2050/monoline-ui/action-rail"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={() => (
				<div className="grid gap-ml-5 p-ml-6 w-full max-w-sm">
					<div className="flex flex-col gap-ml-6">
						<div>
							<h4 className="font-mono text-xs text-(--text-muted) mb-ml-2">
								Vertical Layout
							</h4>
							<ActionRail
								orientation="vertical"
								className="w-fit border p-ml-2 rounded-md"
							>
								<Button variant="ghost" size="sm" icon aria-label="Action 1">
									A
								</Button>
								<Button variant="ghost" size="sm" icon aria-label="Action 2">
									B
								</Button>
								<Button variant="ghost" size="sm" icon aria-label="Action 3">
									C
								</Button>
							</ActionRail>
						</div>
						<div>
							<h4 className="font-mono text-xs text-(--text-muted) mb-ml-2">
								Horizontal Layout
							</h4>
							<ActionRail
								orientation="horizontal"
								className="border p-ml-2 rounded-md w-fit"
							>
								<Button variant="ghost" size="sm" icon aria-label="Action 1">
									X
								</Button>
								<Button variant="ghost" size="sm" icon aria-label="Action 2">
									Y
								</Button>
								<Button variant="ghost" size="sm" icon aria-label="Action 3">
									Z
								</Button>
							</ActionRail>
						</div>
					</div>
				</div>
			)}
		/>
	)
}
