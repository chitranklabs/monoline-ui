// @vitest-environment node
import Ajv from "ajv"
import { load } from "js-yaml"
import { readFile } from "node:fs/promises"
import ts from "typescript"
import { expect, it } from "vitest"

import { defineConfig } from "./config.ts"

const schema = JSON.parse(
	await readFile(new URL("../schema.json", import.meta.url), "utf8")
)
const validate = new Ajv({ allErrors: true }).compile(schema)

it("covers the public configuration properties and rejects unknown keys", async () => {
	const source = ts.createSourceFile(
		"config.ts",
		await readFile(new URL("./config.ts", import.meta.url), "utf8"),
		ts.ScriptTarget.Latest,
		true
	)
	const interfaces = new Map(
		source.statements
			.filter(ts.isInterfaceDeclaration)
			.map((node) => [node.name.text, node])
	)
	const paths = {
		MonolineDocsConfig: schema,
		DocsBrandingConfig: schema.properties.branding,
		DocsHeaderConfig: schema.properties.header,
		DocsAppearanceConfig: schema.properties.appearance,
		DocsContentConfig: schema.properties.content,
		DocsSidebarConfig: schema.properties.sidebar,
		DocsSearchConfig: schema.properties.search,
		DocsSeoConfig: schema.properties.seo,
		DocsLink: schema.definitions.link,
		DocsLogo: schema.definitions.logo,
		DocsEditLink: schema.definitions.editLink,
		DocsFont: schema.definitions.font,
	}
	for (const [name, shape] of Object.entries(paths)) {
		const declaration = interfaces.get(name)!
		expect(Object.keys(shape.properties).sort(), name).toEqual(
			declaration.members.map((member) => member.name!.getText(source)).sort()
		)
		expect(shape.additionalProperties, name).toBe(false)
	}
	expect(validate({ title: "Docs", seach: {} })).toBe(false)
	expect(validate({ title: "Docs", appearance: { raduis: 0.5 } })).toBe(false)
})

it("accepts the runtime configuration shapes including sections and legacy aliases", () => {
	const configuration = {
		title: "Docs",
		site: "https://example.com",
		base: "/handbook/",
		branding: {
			logo: { src: "/assets/logo.svg", alt: "Docs", width: 24, height: 24 },
		},
		header: { primaryAction: { label: "Start", href: "/" } },
		appearance: { radius: 0.5, accent: { light: "#123456", dark: "#abcdef" } },
		navigation: {
			sections: [
				{
					label: "Docs",
					href: "/",
					items: [{ label: "Guides", items: [{ label: "Home", href: "/" }] }],
				},
			],
		},
	}
	expect(() =>
		defineConfig(configuration as Parameters<typeof defineConfig>[0])
	).not.toThrow()
	expect(validate(configuration), JSON.stringify(validate.errors)).toBe(true)
	expect(
		validate({
			title: "Docs",
			defaultMode: "dark",
			headerLinks: [],
			editLink: { href: "https://example.com/{path}" },
		})
	).toBe(true)
})

it.each([
	{},
	{ title: " " },
	{ title: "Docs", appearance: { radius: 2 } },
	{ title: "Docs", appearance: { accent: { light: "red", dark: "#123456" } } },
	{ title: "Docs", navigation: { sections: [] } },
	{ title: "Docs", navigation: [{ label: "Both", href: "/", items: [] }] },
	{ title: "Docs", navigation: [{ label: "Leaf", href: "/", expanded: true }] },
	{
		title: "Docs",
		navigation: [{ label: "Group", items: [], style: "plain", expanded: true }],
	},
	{
		title: "Docs",
		navigation: [
			{ label: "Group", items: [{ label: "Bad", href: "/", typo: true }] },
		],
	},
])("rejects invalid editor configuration %#", (configuration) => {
	expect(validate(configuration)).toBe(false)
})

it("accepts the real demo YAML configuration", async () => {
	const configuration = load(
		await readFile(
			new URL("../../../apps/docs-demo/monoline-docs.yml", import.meta.url),
			"utf8"
		)
	)
	expect(validate(configuration), JSON.stringify(validate.errors)).toBe(true)
})
