"use client"

import { Button } from "@chitrank2050/monoline-ui/button"
import { Navbar, type NavbarSize } from "@chitrank2050/monoline-ui/navbar"
import { Progress, type ProgressSize } from "@chitrank2050/monoline-ui/progress"

import { ComponentPlayground } from "../../_components/component-playground"

const progressSizes: ProgressSize[] = ["sm", "md", "lg"]

const propsRows = [
	["value", "number | null", "Determinate value. Null renders indeterminate."],
	["max", "number", "Upper bound for determinate scaling"],
	["size", '"sm" | "md" | "lg"', "Track thickness"],
	["followScroll", "boolean", "Drive the indicator from document scroll"],
	["className", "string", "Use for full-width and under-navbar placement"],
] as const

const tokenRows = [
	["--accent", "Indicator colour"],
	["--border", "Track colour"],
	["--duration-micro", "Determinate width transition timing"],
	["progress-loop", "Indeterminate sweep animation"],
] as const

const sourceSnippet = `import { Navbar } from "@chitrank2050/monoline-ui/navbar"
import { Progress } from "@chitrank2050/monoline-ui/progress"
import { Button } from "@chitrank2050/monoline-ui/button"

export function ReadingHeader() {
  return (
    <>
      <Navbar
        brand="Chitrank"
        links={[{ href: "/blog", label: "Blog", active: true }]}
        actions={<Button size="sm" variant="secondary">Contact</Button>}
        sticky
      />
      <Progress followScroll className="w-full" />
    </>
  )
}`

const usageCode = `<Progress value={32} />
<Progress value={null} />
<Progress followScroll className="w-full" />`

function ProgressDemo({ size }: { size: ProgressSize }) {
	return (
		<div className="w-full">
			<Navbar
				size={size as NavbarSize}
				brand="Chitrank"
				links={[
					{ href: "/projects", label: "Projects" },
					{ href: "/blog", label: "Blog", active: true },
				]}
				actions={
					<Button size="sm" variant="secondary">
						Contact
					</Button>
				}
			/>
			<Progress size={size} value={34} className="w-full" />
			<div className="border-b border-border px-ml-8 py-ml-6">
				<a
					href="#"
					className="inline-flex items-center gap-ml-2 text-sm text-body no-underline opacity-72 transition-[color,opacity] duration-(--duration-micro) ease-out hover:text-primary hover:opacity-100"
				>
					<span aria-hidden="true"> - </span>
					<span>Back to journal</span>
				</a>
			</div>
		</div>
	)
}

export default function ProgressPageClient() {
	return (
		<ComponentPlayground<ProgressSize>
			title="Progress"
			description="A thin accent progress line for reading position, uploads, and ambient page state. Pair it directly under Navbar for article and journal layouts."
			sizes={progressSizes}
			defaultSize="md"
			importStatement='import { Progress } from "@chitrank2050/monoline-ui/progress"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			previewLayout="viewport"
			renderPreview={(size = "md") => <ProgressDemo size={size} />}
		/>
	)
}
