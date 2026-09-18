import type { NavigationItem } from "./navigation.ts"

export interface DocsLink {
	label: string
	href: string
}

export interface DocsLogo {
	src: string
	alt: string
	width: number
	height: number
}

export interface DocsEditLink {
	href: string
	label?: string
}

export interface DocsBrandingConfig {
	logo?: DocsLogo
}

export interface DocsHeaderConfig {
	links?: DocsLink[]
}

export interface DocsAppearanceConfig {
	defaultMode?: "light" | "dark" | "system"
}

export interface DocsContentConfig {
	editLink?: DocsEditLink
}

export interface DocsSearchConfig {
	enabled?: boolean
}

export interface DocsSeoConfig {
	/** `%s` is replaced with the page SEO title. */
	titleTemplate?: string
}

export interface MonolineDocsConfig {
	title: string
	description?: string
	/** Absolute HTTP(S) origin; deployment subdirectories belong in base. */
	site?: string
	/** Disable indexing for hosted previews without including development drafts. */
	indexing?: boolean
	base?: string
	/** Emit extensionless links backed by flat .html files. */
	cleanUrls?: boolean
	lang?: string
	contentDirectory?: string
	outDirectory?: string
	assetsDirectory?: string
	stylesheet?: string
	navigation?: NavigationItem[]
	branding?: DocsBrandingConfig
	header?: DocsHeaderConfig
	appearance?: DocsAppearanceConfig
	content?: DocsContentConfig
	search?: DocsSearchConfig
	seo?: DocsSeoConfig
	/** @deprecated Use appearance.defaultMode. */
	defaultMode?: "light" | "dark" | "system"
	/** @deprecated Use branding.logo. */
	logo?: DocsLogo
	/** @deprecated Use header.links. */
	headerLinks?: DocsLink[]
	footer?: {
		text?: string
		links?: Array<{ label: string; href: string }>
	}
	/** @deprecated Use content.editLink. */
	editLink?: DocsEditLink
	/** Enable React components and explicit Astro client directives in MDX. */
	react?: boolean
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
		"indexing",
		"base",
		"cleanUrls",
		"lang",
		"contentDirectory",
		"outDirectory",
		"assetsDirectory",
		"stylesheet",
		"navigation",
		"branding",
		"header",
		"appearance",
		"content",
		"search",
		"seo",
		"defaultMode",
		"logo",
		"headerLinks",
		"footer",
		"editLink",
		"react",
		"environment",
	])
	string(config.title, "title")
	if (config.indexing !== undefined && typeof config.indexing !== "boolean")
		throw new Error("indexing must be a boolean")
	if (config.cleanUrls !== undefined && typeof config.cleanUrls !== "boolean")
		throw new Error("cleanUrls must be a boolean")
	if (config.react !== undefined && typeof config.react !== "boolean")
		throw new Error("react must be a boolean")
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
	if (config.branding !== undefined)
		object(config.branding as unknown, "branding", ["logo"])
	if (config.header !== undefined)
		object(config.header as unknown, "header", ["links"])
	if (config.appearance !== undefined)
		object(config.appearance as unknown, "appearance", ["defaultMode"])
	if (config.content !== undefined)
		object(config.content as unknown, "content", ["editLink"])
	if (config.search !== undefined)
		object(config.search as unknown, "search", ["enabled"])
	if (config.seo !== undefined)
		object(config.seo as unknown, "seo", ["titleTemplate"])

	const logo = config.branding?.logo ?? config.logo
	const headerLinks = config.header?.links ?? config.headerLinks
	const editLink = config.content?.editLink ?? config.editLink
	const defaultMode =
		config.appearance?.defaultMode ?? config.defaultMode ?? "system"
	if (!["light", "dark", "system"].includes(defaultMode))
		throw new Error("appearance.defaultMode must be light, dark, or system")
	const environment = config.environment ?? "production"
	if (!["production", "development"].includes(environment))
		throw new Error("environment must be production or development")
	if (
		config.stylesheet &&
		(!config.stylesheet.startsWith("/assets/") ||
			!config.stylesheet.endsWith(".css"))
	)
		throw new Error("stylesheet must name a local /assets/*.css file")
	if (logo !== undefined) {
		object(logo as unknown, "branding.logo", ["src", "alt", "width", "height"])
		string(logo.src, "branding.logo.src")
		string(logo.alt, "branding.logo.alt")
		if (!/^\/assets\/.+\.(svg|png|jpe?g|webp|avif|gif)$/i.test(logo.src))
			throw new Error("branding.logo.src must name a local /assets/ image")
		for (const key of ["width", "height"] as const)
			if (!Number.isInteger(logo[key]) || logo[key] <= 0)
				throw new Error(`branding.logo.${key} must be a positive integer`)
	}
	function links(value: unknown, path: string): void {
		if (!Array.isArray(value)) throw new Error(`${path} must be an array`)
		for (const link of value) {
			object(link, `${path} entry`, ["label", "href"])
			string(link.label, `${path}.label`)
			string(link.href, `${path}.href`)
			if (!safeRoute(link.href)) httpUrl(link.href, `${path}.href`)
		}
	}
	if (headerLinks !== undefined) links(headerLinks, "header.links")
	if (config.footer !== undefined) {
		object(config.footer, "footer", ["text", "links"])
		if (config.footer.text !== undefined)
			string(config.footer.text, "footer.text")
		if (config.footer.links !== undefined)
			links(config.footer.links, "footer.links")
		if (!config.footer.text && !config.footer.links?.length)
			throw new Error("footer must contain text or at least one link")
	}
	if (editLink !== undefined) {
		object(editLink, "content.editLink", ["href", "label"])
		string(editLink.href, "content.editLink.href")
		if (!editLink.href.includes("{path}"))
			throw new Error("content.editLink.href must contain {path}")
		httpUrl(editLink.href.replace("{path}", "page.md"), "content.editLink.href")
		if (editLink.label !== undefined)
			string(editLink.label, "content.editLink.label")
	}
	const searchEnabled = config.search?.enabled ?? true
	if (typeof searchEnabled !== "boolean")
		throw new Error("search.enabled must be a boolean")
	const titleTemplate = config.seo?.titleTemplate ?? `%s | ${config.title}`
	string(titleTemplate, "seo.titleTemplate")
	if (!titleTemplate.includes("%s"))
		throw new Error("seo.titleTemplate must contain %s")
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
		indexing: config.indexing ?? true,
		site,
		base,
		cleanUrls: config.cleanUrls ?? false,
		lang,
		branding: { ...config.branding, ...(logo ? { logo } : {}) },
		header: {
			...config.header,
			...(headerLinks ? { links: headerLinks } : {}),
		},
		appearance: { ...config.appearance, defaultMode },
		content: { ...config.content, ...(editLink ? { editLink } : {}) },
		search: { ...config.search, enabled: searchEnabled },
		seo: { ...config.seo, titleTemplate },
		defaultMode,
		logo,
		headerLinks,
		editLink,
		react: config.react ?? false,
		environment,
		contentDirectory: config.contentDirectory ?? "./content",
		outDirectory: config.outDirectory ?? "./dist",
	}
}
