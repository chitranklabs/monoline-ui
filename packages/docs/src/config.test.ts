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
	[{ navigation: [{ label: "Guides", tabs: [] }] }, "navigation entry.tabs"],
	[{ seo: { socialImage: "/assets/social.png" } }, "seo.socialImage"],
	[{ search: { enabled: "yes" } }, "search.enabled"],
	[{ seo: { titleTemplate: "Documentation" } }, "contain %s"],
])("rejects invalid nested configuration %j", (input, error) => {
	expect(() =>
		defineConfig({ title: "Docs", ...input } as unknown as MonolineDocsConfig)
	).toThrow(error)
})

it.each([
	{ appearance: { defaultMode: "dark" }, defaultMode: "light" },
	{ header: { links: [] }, headerLinks: [{ label: "Home", href: "/" }] },
	{
		branding: {
			logo: { src: "/assets/new.svg", alt: "New", width: 24, height: 24 },
		},
		logo: { src: "/assets/old.svg", alt: "Old", width: 24, height: 24 },
	},
	{
		content: { editLink: { href: "https://example.com/new/{path}" } },
		editLink: { href: "https://example.com/old/{path}" },
	},
])("rejects conflicting flat and nested aliases %j", (input) => {
	expect(() =>
		defineConfig({ title: "Docs", ...input } as MonolineDocsConfig)
	).toThrow("conflicts with")
})

it("accepts equivalent aliases and remains safe to normalize twice", () => {
	const config = defineConfig({
		title: "Docs",
		header: { links: [{ label: "Home", href: "/" }] },
		headerLinks: [{ href: "/", label: "Home" }],
	})
	expect(defineConfig(config)).toEqual(config)
})

it("normalizes shell controls without mutating input", () => {
	const input = {
		title: "Docs",
		appearance: {
			density: "compact",
			radius: 0,
			accent: { light: "#753c22", dark: "#e9b894" },
			fonts: {
				body: { family: "Georgia" },
				code: { family: "Local Code", src: "/assets/code.woff2" },
			},
		},
		branding: { favicon: "/assets/icon.svg" },
		header: {
			primaryAction: { label: "Start", href: "/guide" },
			announcement: { text: "SDK 1.0", href: "https://example.com/release" },
		},
		sidebar: { enabled: false },
		content: { showLastUpdated: false, copyPageLink: false },
	} as const
	const config = defineConfig(input)
	expect(config.appearance).toMatchObject(input.appearance)
	expect(config.header).toEqual(input.header)
	expect(config.branding).toEqual(input.branding)
	expect(config.sidebar.enabled).toBe(false)
	expect(config.content).toEqual(input.content)
	expect(defineConfig(config)).toEqual(config)
	expect(defineConfig({ title: "Docs" })).toMatchObject({
		appearance: { density: "comfortable" },
		sidebar: { enabled: true },
		content: { showLastUpdated: true, copyPageLink: true },
	})
})

it("accepts section navigation and preserves repeated normalization", () => {
	const config = defineConfig({
		title: "Docs",
		navigation: {
			sections: [
				{
					label: "Guides",
					href: "/",
					icon: "◇",
					badge: "New",
					order: 1,
					items: [
						{
							label: "Getting started",
							expanded: true,
							items: [{ label: "Home", href: "/", order: 1 }],
						},
					],
				},
			],
		},
	})
	expect(defineConfig(config)).toEqual(config)
})

it.each([
	[{ navigation: { sections: [] } }, "non-empty"],
	[
		{
			navigation: {
				sections: [{ label: "Guide", href: "/", items: [], typo: true }],
			},
		},
		"typo",
	],
	[{ navigation: [{ label: "Home", href: "/", expanded: true }] }, "expanded"],
	[
		{ navigation: [{ label: "Home", href: "/", icon: "/assets/icon.svg" }] },
		"icon",
	],
	[{ navigation: [{ label: "Home", href: "/", badge: " " }] }, "badge"],
	[{ navigation: [{ label: "Home", href: "/", order: NaN }] }, "order"],
	[
		{ navigation: [{ label: "Guides", items: [], expanded: "yes" }] },
		"expanded",
	],
])("rejects invalid navigation options %j", (input, error) => {
	expect(() =>
		defineConfig({ title: "Docs", ...input } as unknown as MonolineDocsConfig)
	).toThrow(error)
})

it.each([
	[{ appearance: { density: "dense" } }, "appearance.density"],
	[{ appearance: { density: null } }, "appearance.density"],
	[{ appearance: { radius: -1 } }, "appearance.radius"],
	[{ appearance: { radius: 2 } }, "appearance.radius"],
	[{ appearance: { radius: "0; color:red" } }, "appearance.radius"],
	[
		{ appearance: { accent: { light: "red", dark: "#ffffff" } } },
		"appearance.accent.light",
	],
	[
		{ appearance: { fonts: { body: { family: "</style><script>" } } } },
		"appearance.fonts.body.family",
	],
	[
		{
			appearance: {
				fonts: {
					code: { family: "Code", src: "https://example.com/code.woff2" },
				},
			},
		},
		"appearance.fonts.code.src",
	],
	[
		{
			appearance: {
				fonts: { code: { family: "Code", src: "/assets/../code.woff2" } },
			},
		},
		"appearance.fonts.code.src",
	],
	[{ branding: { favicon: "/assets/../icon.svg" } }, "branding.favicon"],
	[
		{
			header: {
				primaryAction: { label: "Start", href: "javascript:alert(1)" },
			},
		},
		"header.primaryAction.href",
	],
	[
		{ header: { announcement: { text: "News", href: "//example.com" } } },
		"header.announcement.href",
	],
	[{ header: { announcement: { text: " " } } }, "header.announcement.text"],
	[{ sidebar: { enabled: "yes" } }, "sidebar.enabled"],
	[{ content: { copyPageLink: "yes" } }, "content.copyPageLink"],
	[{ content: { showLastUpdated: "yes" } }, "content.showLastUpdated"],
])("rejects invalid shell controls %j", (input, error) => {
	expect(() =>
		defineConfig({ title: "Docs", ...input } as unknown as MonolineDocsConfig)
	).toThrow(error)
})
