import type { NavigationItem } from "./navigation.ts"

export interface MonolineDocsConfig {
	title: string
	description?: string
	/** Absolute HTTP(S) origin; deployment subdirectories belong in base. */
	site?: string
	base?: string
	lang?: string
	contentDirectory?: string
	outDirectory?: string
	assetsDirectory?: string
	stylesheet?: string
	navigation?: NavigationItem[]
	defaultMode?: "light" | "dark" | "system"
	logo?: { src: string; alt: string; width: number; height: number }
	headerLinks?: Array<{ label: string; href: string }>
	environment?: "production" | "development"
}

export function safeRoute(route: string): boolean {
	return (
		route === "/" || /^\/(?:[\p{L}\p{N}_-]+\/)*[\p{L}\p{N}_-]+$/u.test(route)
	)
}

function object(
	value: unknown,
	path: string,
	keys: string[]
): asserts value is Record<string, unknown> {
	if (!value || typeof value !== "object" || Array.isArray(value))
		throw new Error(`${path} must be an object`)
	for (const key of Object.keys(value))
		if (!keys.includes(key)) throw new Error(`Unknown option ${path}.${key}`)
}
function string(value: unknown, path: string): asserts value is string {
	if (typeof value !== "string" || !value.trim())
		throw new Error(`${path} must be a non-empty string`)
}
function httpUrl(value: string, path: string): URL {
	let url: URL
	try {
		url = new URL(value)
	} catch {
		throw new Error(`${path} must be an absolute HTTP(S) URL`)
	}
	if (
		!/^https?:\/\//i.test(value) ||
		!["http:", "https:"].includes(url.protocol) ||
		url.username ||
		url.password ||
		/[\s\\]/.test(value)
	)
		throw new Error(
			`${path} must be an absolute HTTP(S) URL without credentials`
		)
	return url
}

/** Reject misspelled options from JavaScript callers before touching output. */
export function defineConfig(config: MonolineDocsConfig) {
	object(config, "config", [
		"title",
		"description",
		"site",
		"base",
		"lang",
		"contentDirectory",
		"outDirectory",
		"assetsDirectory",
		"stylesheet",
		"navigation",
		"defaultMode",
		"logo",
		"headerLinks",
		"environment",
	])
	string(config.title, "title")
	for (const key of [
		"description",
		"site",
		"base",
		"lang",
		"contentDirectory",
		"outDirectory",
		"assetsDirectory",
		"stylesheet",
	] as const) {
		if (config[key] !== undefined) string(config[key], key)
	}
	const base = config.base ?? "/"
	if (base !== "/" && (!base.endsWith("/") || !safeRoute(base.slice(0, -1))))
		throw new Error("base must be / or an absolute directory path ending in /")
	let site = config.site
	if (site) {
		const url = httpUrl(site, "site")
		if (url.pathname !== "/" || url.search || url.hash)
			throw new Error(
				"site must be an origin without a path, query, or fragment; use base for subdirectories"
			)
		site = url.origin
	}
	let lang: string
	try {
		lang = Intl.getCanonicalLocales(config.lang ?? "en")[0]!
	} catch {
		throw new Error("lang must be a valid BCP 47 language tag")
	}
	const defaultMode = config.defaultMode ?? "system"
	if (!["light", "dark", "system"].includes(defaultMode))
		throw new Error("defaultMode must be light, dark, or system")
	const environment = config.environment ?? "production"
	if (!["production", "development"].includes(environment))
		throw new Error("environment must be production or development")
	if (
		config.stylesheet &&
		(!config.stylesheet.startsWith("/assets/") ||
			!config.stylesheet.endsWith(".css"))
	)
		throw new Error("stylesheet must name a local /assets/*.css file")
	if (config.logo !== undefined) {
		object(config.logo, "logo", ["src", "alt", "width", "height"])
		string(config.logo.src, "logo.src")
		string(config.logo.alt, "logo.alt")
		if (!/^\/assets\/.+\.(svg|png|jpe?g|webp|avif|gif)$/i.test(config.logo.src))
			throw new Error("logo.src must name a local /assets/ image")
		for (const key of ["width", "height"] as const)
			if (!Number.isInteger(config.logo[key]) || config.logo[key] <= 0)
				throw new Error(`logo.${key} must be a positive integer`)
	}
	if (config.headerLinks !== undefined) {
		if (!Array.isArray(config.headerLinks))
			throw new Error("headerLinks must be an array")
		for (const link of config.headerLinks) {
			object(link, "headerLinks entry", ["label", "href"])
			string(link.label, "headerLinks.label")
			string(link.href, "headerLinks.href")
			httpUrl(link.href, "headerLinks.href")
		}
	}
	const seen = new Set<unknown>()
	function navigation(items: unknown, depth = 0): void {
		if (!Array.isArray(items)) throw new Error("navigation must be an array")
		if (depth > 20 || seen.has(items))
			throw new Error("navigation is cyclic or exceeds 20 nested groups")
		seen.add(items)
		for (const item of items) {
			object(item, "navigation entry", ["label", "href", "items"])
			string(item.label, "navigation.label")
			if ((item.href !== undefined) === (item.items !== undefined))
				throw new Error(
					"navigation entry must have exactly one of href or items"
				)
			if (item.href !== undefined) {
				string(item.href, "navigation.href")
				if (!safeRoute(item.href))
					throw new Error("navigation.href must be a documentation route")
			} else navigation(item.items, depth + 1)
		}
		seen.delete(items)
	}
	if (config.navigation !== undefined) navigation(config.navigation)
	return {
		...config,
		site,
		base,
		lang,
		defaultMode,
		environment,
		contentDirectory: config.contentDirectory ?? "./content",
		outDirectory: config.outDirectory ?? "./dist",
	}
}
