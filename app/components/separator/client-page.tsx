"use client"

import { Separator } from "@chitrank2050/monoline-ui/separator"

import { ComponentPlayground } from "../../_components/component-playground"

const example = `<div>
  <p>Account</p>
  <Separator />
  <p>Billing</p>
</div>`

export default function SeparatorPageClient() {
	return (
		<ComponentPlayground
			title="Separator"
			description="Divide adjacent groups with a quiet rule that can be decorative or exposed to assistive technology."
			importStatement='import { Separator } from "@chitrank2050/monoline-ui/separator"'
			usageCode={example}
			sourceSnippet={example}
			props={[
				["orientation", '"horizontal" | "vertical"', "Axis of the divider"],
				[
					"decorative",
					"boolean",
					"Removes separator semantics when purely visual",
				],
			]}
			tokens={[
				["--border-strong", "Divider color"],
				["--border-thin", "Divider thickness"],
			]}
			renderPreview={() => (
				<div className="grid min-w-112 gap-ml-4 p-ml-8">
					<p className="m-0 font-mono text-3xs tracking-eyebrow text-(--accent) uppercase">
						Workspace settings
					</p>
					<div>
						<p className="m-0 font-medium text-primary">Account</p>
						<p className="m-0 text-sm text-text-muted">
							Profile and sign-in settings
						</p>
					</div>
					<Separator />
					<div>
						<p className="m-0 font-medium text-primary">Billing</p>
						<p className="m-0 text-sm text-text-muted">
							Plan and invoice settings
						</p>
					</div>
				</div>
			)}
		/>
	)
}
