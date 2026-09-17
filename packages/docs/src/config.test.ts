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
		defaultMode: "system",
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
	[{ defaultMode: "sepia" }, "defaultMode"],
	[{ environment: "prod" }, "environment"],
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
