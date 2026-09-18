// @vitest-environment node
import { expect, it } from "vitest"

import { type MonolineDocsConfig, defineConfig } from "./config"

it("resolves defaults and canonicalizes origin and language without mutating input", () => {
	const input = {
		title: "Handbook",
		site: "https://example.com/",
		lang: "en-us",
	}
	expect(defineConfig(input)).toMatchObject({
		base: "/",
		cleanUrls: false,
		defaultMode: "system",
		appearance: { defaultMode: "system" },
		search: { enabled: true },
		seo: { titleTemplate: "%s | Handbook" },
		lang: "en-US",
		site: "https://example.com",
		contentDirectory: "./content",
		outDirectory: "./dist",
		environment: "production",
		react: false,
	})
	expect(input.site).toBe("https://example.com/")
})

it.each([
	[{ titel: "Typo" }, "config.titel"],
	[{ title: 42 }, "title"],
	[{ base: "/missing-trailing-slash" }, "base"],
	[{ site: "javascript:alert(1)" }, "HTTP(S)"],
	[
		{ headerLinks: [{ label: "Ambiguous", href: "https:example.com" }] },
		"HTTP(S)",
	],
	[{ site: "https://user:password@example.com" }, "credentials"],
	[{ site: "https://example.com/docs/" }, "origin"],
	[{ lang: "not_a_language" }, "BCP 47"],
	[{ defaultMode: "sepia" }, "appearance.defaultMode"],
	[{ environment: "prod" }, "environment"],
	[{ cleanUrls: "yes" }, "cleanUrls"],
	[{ react: "yes" }, "react"],
	[{ stylesheet: "https://example.com/style.css" }, "stylesheet"],
	[{ headerLinks: [{ label: "Unsafe", href: "//example.com" }] }, "HTTP(S)"],
	[
		{ logo: { src: "/assets/logo.svg", alt: "Logo", width: 0, height: 20 } },
		"logo.width",
	],
	[
		{
			logo: {
				src: "/assets/logo.svg",
				alt: "Logo",
				width: 20,
				height: 20,
				typo: true,
			},
		},
		"logo.typo",
	],
	[{ navigation: [{ label: "Both", href: "/", items: [] }] }, "exactly one"],
	[{ navigation: [{ label: "Empty" }] }, "exactly one"],
] as const)("rejects invalid configuration %j", (input, error) => {
	expect(() =>
		defineConfig({ title: "Docs", ...input } as unknown as MonolineDocsConfig)
	).toThrow(error)
})

it("rejects cyclic navigation without overflowing the stack", () => {
	const navigation: NonNullable<MonolineDocsConfig["navigation"]> = []
	navigation.push({ label: "Cycle", items: navigation })
	expect(() => defineConfig({ title: "Docs", navigation })).toThrow("cyclic")
})

it("accepts base-aware site chrome and an edit URL template", () => {
	expect(
		defineConfig({
			title: "Docs",
			headerLinks: [
				{ label: "Guide", href: "/guide" },
				{ label: "GitHub", href: "https://github.com/example/docs" },
			],
			footer: {
				text: "Released under MIT.",
				links: [{ label: "Home", href: "/" }],
			},
			editLink: {
				href: "https://github.com/example/docs/edit/main/{path}",
			},
		})
	).toMatchObject({
		footer: { text: "Released under MIT." },
		editLink: {
			href: "https://github.com/example/docs/edit/main/{path}",
		},
	})
})

it.each([
	[
		{ headerLinks: [{ label: "Unsafe", href: "javascript:alert(1)" }] },
		"HTTP(S)",
	],
	[{ footer: { typo: true } }, "footer.typo"],
	[{ footer: {} }, "footer must contain"],
	[
		{ footer: { links: [{ label: "Unsafe", href: "mailto:a@example.com" }] } },
		"HTTP(S)",
	],
	[
		{ editLink: { href: "https://github.com/example/docs/edit/main/page.md" } },
		"{path}",
	],
])("rejects invalid site chrome %j", (input, error) => {
	expect(() =>
		defineConfig({ title: "Docs", ...input } as unknown as MonolineDocsConfig)
	).toThrow(error)
})

it("normalizes the nested product configuration for existing renderers", () => {
	const config = defineConfig({
		title: "Docs",
		branding: {
			logo: {
				src: "/assets/logo.svg",
				alt: "Docs",
				width: 24,
				height: 24,
			},
		},
		header: { links: [{ label: "Guide", href: "/guide" }] },
		appearance: { defaultMode: "dark" },
		content: {
			editLink: {
				href: "https://github.com/example/docs/edit/main/{path}",
			},
		},
		search: { enabled: false },
		seo: { titleTemplate: "%s · Documentation" },
	})

	expect(config).toMatchObject({
		defaultMode: "dark",
		headerLinks: [{ label: "Guide", href: "/guide" }],
		search: { enabled: false },
		seo: { titleTemplate: "%s · Documentation" },
	})
	expect(config.logo).toBe(config.branding.logo)
	expect(config.editLink).toBe(config.content.editLink)
})

it.each([
	[{ branding: { typo: true } }, "branding.typo"],
	[{ search: { enabled: "yes" } }, "search.enabled"],
	[{ seo: { titleTemplate: "Documentation" } }, "contain %s"],
])("rejects invalid nested configuration %j", (input, error) => {
	expect(() =>
		defineConfig({ title: "Docs", ...input } as unknown as MonolineDocsConfig)
	).toThrow(error)
})
