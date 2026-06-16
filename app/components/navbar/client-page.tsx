"use client"

import { Button } from "@chitrank2050/monoline-ui/button"
import { Progress } from "@chitrank2050/monoline-ui/components/progress"
import {
	Navbar,
	type NavbarLayout,
	type NavbarSize,
} from "@chitrank2050/monoline-ui/navbar"

import { ComponentPlayground } from "../../_components/component-playground"

const navbarSizes: NavbarSize[] = ["sm", "md", "lg"]

const navbarLinks = [{ href: "#blog", label: "Blog" }]

const propsRows = [
	["size", "sm | md | lg", "Navbar density and type scale"],
	[
		"layout",
		"contained | extended",
		"Contained aligns with page content; extended fills app-shell headers",
	],
	["brand", "ReactNode", "Left-side brand slot for data-driven usage"],
	["brandTextStyle", "monoline | cursive", "Brand wordmark font style"],
	["links", "NavbarLinkItem[]", "Optional data-driven nav link list"],
	["actions", "ReactNode", "Right-side action slot"],
	["children", "ReactNode", "Override with compound composition"],
	["Progress", "pairing pattern", "Place under Navbar for reading progress"],
	["Navbar.Nav", "compound slot", "Middle navigation region"],
	["linkComponent", "ComponentType", "Next Link or router link adapter"],
	["sticky", "boolean", "Apply sticky positioning top-0 (default: false)"],
	[
		"glass",
		"boolean",
		"Translucent backdrop with blur filter (default: false)",
	],
] as const

const tokenRows = [
	["--ml-navbar-height", "Header minimum height per size"],
	["--ml-navbar-container-max", "Contained header max width"],
	["--ml-navbar-x", "Inline container padding"],
	["--ml-navbar-link-gap", "Navigation item spacing"],
	["--focus-ring", "Keyboard focus treatment"],
] as const

const sourceSnippet = `import { Navbar } from "@chitrank2050/monoline-ui/navbar"
import { Button } from "@chitrank2050/monoline-ui/button"
import { Progress } from "@chitrank2050/monoline-ui/progress"

export function SiteHeader() {
  return (
    <>
      <Navbar
        brand="Chitrank"
        layout="contained"
        brandTextStyle="cursive"
        links={[
          { href: "/blog", label: "Blog" },
        ]}
        actions={<Button size="sm">Contact</Button>}
        sticky
        glass
      />
      <Progress followScroll />
    </>
  )
}`

const usageCode = `<Navbar
  brand="Chitrank"
  layout="contained"
  links={[
    { href: "/blog", label: "Blog" },
  ]}
  actions={<Button size="sm">Contact</Button>}
  sticky
  glass
/>
<Progress followScroll />

<Navbar layout="extended" sticky glass>
  <Navbar.Brand href="/" mark={<span />} textStyle="monoline">
    monoline/ui
  </Navbar.Brand>
  <Navbar.Nav>
    <Navbar.Link href="/blog">Blog</Navbar.Link>
  </Navbar.Nav>
  <Navbar.Actions>
    <Button size="sm">Contact</Button>
  </Navbar.Actions>
</Navbar>`

const variants = ["contained", "extended", "glass", "extended-glass"] as const
type NavbarVariant = (typeof variants)[number]

export default function NavbarPageClient() {
	return (
		<ComponentPlayground<NavbarSize, NavbarVariant>
			title="Navbar"
			description="Render a token-backed site header with brand, navigation links, and an action slot. Use data props for simple headers or compound slots for custom app composition."
			sizes={navbarSizes}
			defaultSize="md"
			variants={variants as any}
			defaultVariant="contained"
			formatVariant={(v) => v.toUpperCase().replace("-", " + ")}
			importStatement='import { Navbar } from "@chitrank2050/monoline-ui/navbar"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			previewLayout="viewport"
			renderPreview={(size = "md", theme, variant = "contained") => {
				const layout: NavbarLayout =
					variant === "extended" || variant === "extended-glass"
						? "extended"
						: "contained"
				const isGlass = variant === "glass" || variant === "extended-glass"
				return (
					<div className="w-full" style={{ minHeight: "120px" }}>
						<Navbar
							size={size}
							layout={layout}
							brand="Chitrank"
							links={navbarLinks}
							glass={isGlass}
							actions={
								<Button size="sm" variant="secondary">
									Contact
								</Button>
							}
						/>
						<Progress size={size} value={38} className="w-full" />
						<div className="p-ml-6 text-muted-foreground text-sm font-mono text-center">
							Page content space (simulating page content behind a sticky/glass
							header)
						</div>
					</div>
				)
			}}
		/>
	)
}
