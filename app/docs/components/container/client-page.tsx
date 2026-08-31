"use client"

import {
	Container,
	type ContainerSize,
} from "@chitrank2050/monoline-ui/container"

import { ComponentPlayground } from "../../../_components/component-playground"

const containerSizes: ContainerSize[] = ["sm", "md", "lg"]

const usageCode = `<Container size="md" as="section">
  <h2>Project highlights</h2>
  <p>Constrained content with responsive inline padding.</p>
</Container>`

const sourceSnippet = `import { Container } from "@chitrank2050/monoline-ui/container"

export function PageSection() {
  return (
    <Container size="lg" as="section">
      <h2>Project highlights</h2>
      <p>Use Container for page sections, docs content, and marketing blocks.</p>
    </Container>
  )
}`

const propsRows = [
	["size", "sm | md | lg", "Max width and padding scale"],
	["as", "ElementType", "Semantic element override"],
	["children", "ReactNode", "Contained page content"],
	["className", "string", "Additional class names"],
] as const

const tokenRows = [
	["--ml-container-max", "Current max-width for the selected size"],
	["--ml-container-x", "Mobile inline padding"],
	["--ml-container-x-tablet", "Tablet inline padding"],
	["--ml-container-x-desktop", "Desktop inline padding"],
] as const

export default function ContainerPageClient() {
	return (
		<ComponentPlayground<ContainerSize>
			title="Container"
			description="Constrain page content with responsive max widths, horizontal padding tokens, and semantic element overrides."
			sizes={containerSizes}
			defaultSize="md"
			importStatement='import { Container } from "@chitrank2050/monoline-ui/container"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(size = "md") => (
				<div className="w-full p-ml-6">
					<Container size={size} className="border border-dashed py-ml-5">
						<div className="rounded-md border bg-surface p-ml-4">
							<p className="m-0 text-sm text-text-secondary">
								Container {size} keeps content centered and padded across
								viewports.
							</p>
						</div>
					</Container>
				</div>
			)}
		/>
	)
}
