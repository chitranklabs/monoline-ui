import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { readFileSync } from "node:fs"

const SITE_URL = "https://monolineui.chitrankagnihotri.com"
const HOST = "127.0.0.1"
const PORT = Number.parseInt(process.env.SEO_TEST_PORT || "3211", 10)
assert.ok(
	Number.isInteger(PORT) && PORT >= 1 && PORT <= 65_535,
	"SEO_TEST_PORT should be a valid TCP port"
)
const LOCAL_URL = `http://${HOST}:${PORT}`
const STARTUP_TIMEOUT_MS = 60_000
const EXPECTED_ROUTE_COUNT = 43
const CRAWL_CONCURRENCY = 4
const componentMetadata = JSON.parse(
	readFileSync(new URL("../src/metadata.json", import.meta.url), "utf8")
)
assert.ok(
	Array.isArray(componentMetadata.components),
	"metadata.json should contain a components array"
)
const EXPECTED_PATHS = [
	"/",
	"/installation",
	"/foundations/colors",
	"/foundations/typography",
	"/foundations/spacing",
	"/foundations/radius",
	"/foundations/motion",
	...componentMetadata.components.map(
		(component) => `/components/${component}`
	),
].toSorted()
assert.equal(
	EXPECTED_PATHS.length,
	EXPECTED_ROUTE_COUNT,
	`metadata.json and the static docs routes should define exactly ${EXPECTED_ROUTE_COUNT} public routes`
)
assert.equal(
	new Set(EXPECTED_PATHS).size,
	EXPECTED_PATHS.length,
	"metadata-derived public routes should be unique"
)
const EXPECTED_PATH_SET = new Set(EXPECTED_PATHS)

function decodeEntities(value) {
	return value
		.replaceAll("&amp;", "&")
		.replaceAll("&quot;", '"')
		.replaceAll("&#39;", "'")
		.replaceAll("&lt;", "<")
		.replaceAll("&gt;", ">")
}

function getAttribute(tag, attribute) {
	const expression = new RegExp(
		`(?:^|\\s)${attribute}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
		"i"
	)
	const match = tag.match(expression)
	return match ? decodeEntities(match[1] ?? match[2] ?? match[3] ?? "") : null
}

function findElementByAttribute(html, tagName, attribute, expectedValue) {
	const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) ?? []
	return (
		tags.find((tag) => {
			const value = getAttribute(tag, attribute)
			return value
				?.toLowerCase()
				.split(/\s+/)
				.includes(expectedValue.toLowerCase())
		}) ?? null
	)
}

function findElementsByAttribute(html, tagName, attribute, expectedValue) {
	const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) ?? []
	return tags.filter((tag) => {
		const value = getAttribute(tag, attribute)
		return value
			?.toLowerCase()
			.split(/\s+/)
			.includes(expectedValue.toLowerCase())
	})
}

function countElements(html, tagName) {
	return (html.match(new RegExp(`<${tagName}(?:\\s|>)`, "gi")) ?? []).length
}

function extractElementText(html, tagName) {
	const match = html.match(
		new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)</${tagName}>`, "i")
	)
	return decodeEntities(match?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "")
}

function extractTags(html, tagName) {
	return html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) ?? []
}

function extractJsonLd(html) {
	const scripts =
		html.match(
			/<script\b[^>]*type=(?:"application\/ld\+json"|'application\/ld\+json')[^>]*>[\s\S]*?<\/script>/gi
		) ?? []

	return scripts.map((script) => {
		const json = script
			.replace(/^<script\b[^>]*>/i, "")
			.replace(/<\/script>$/i, "")
		return JSON.parse(json)
	})
}

function containsSchemaType(value, expectedType) {
	if (Array.isArray(value)) {
		return value.some((item) => containsSchemaType(item, expectedType))
	}

	if (!value || typeof value !== "object") return false

	const type = value["@type"]
	if (
		type === expectedType ||
		(Array.isArray(type) && type.includes(expectedType))
	) {
		return true
	}

	return Object.values(value).some((item) =>
		containsSchemaType(item, expectedType)
	)
}

async function fetchResponse(pathname, redirect = "manual") {
	return fetch(LOCAL_URL + pathname, {
		headers: {
			"user-agent": "monoline-seo-integration-test/1.0",
			"x-forwarded-host": new URL(SITE_URL).host,
			"x-forwarded-proto": "https",
		},
		redirect,
		signal: AbortSignal.timeout(30_000),
	})
}

async function fetchText(pathname) {
	const response = await fetchResponse(pathname)
	assert.equal(
		response.status,
		200,
		`${pathname} should return HTTP 200, received ${response.status}`
	)
	return response.text()
}

function extractLocs(xml) {
	return [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((match) =>
		decodeEntities(match[1].trim())
	)
}

function extractSitemapEntries(xml) {
	return [...xml.matchAll(/<url\b[^>]*>([\s\S]*?)<\/url>/gi)].map(
		([, entry]) => {
			const locations = extractLocs(entry)
			assert.equal(
				locations.length,
				1,
				"each sitemap URL entry should contain exactly one loc"
			)
			const lastModifiedValues = [
				...entry.matchAll(/<lastmod>([\s\S]*?)<\/lastmod>/gi),
			].map((match) => decodeEntities(match[1].trim()))
			assert.ok(
				lastModifiedValues.length <= 1,
				`${locations[0]} should contain at most one lastmod`
			)
			return { location: locations[0], lastModified: lastModifiedValues[0] }
		}
	)
}

async function getSitemapEntries(sitemapXml) {
	const locations = extractLocs(sitemapXml)
	assert.ok(locations.length > 0, "sitemap.xml should contain URLs")

	if (!/<sitemapindex\b/i.test(sitemapXml)) {
		return extractSitemapEntries(sitemapXml)
	}

	const childSitemaps = await Promise.all(
		locations.map(async (location) => {
			const pathname = new URL(location).pathname
			return fetchText(pathname)
		})
	)

	return childSitemaps.flatMap(extractSitemapEntries)
}

function validateLastModified(value, location) {
	if (value === undefined) return

	assert.match(
		value,
		/^\d{4}-\d{2}-\d{2}(?:T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d))?$/,
		`${location} lastmod should use a W3C date or datetime`
	)
	const [year, month, day] = value
		.slice(0, 10)
		.split("-")
		.map((part) => Number.parseInt(part, 10))
	const calendarDate = new Date(Date.UTC(year, month - 1, day))
	assert.ok(
		calendarDate.getUTCFullYear() === year &&
			calendarDate.getUTCMonth() === month - 1 &&
			calendarDate.getUTCDate() === day,
		`${location} lastmod should contain a real calendar date`
	)
	const timestamp = Date.parse(value)
	assert.ok(Number.isFinite(timestamp), `${location} lastmod should be valid`)
	assert.ok(
		timestamp <= Date.now() + 60_000,
		`${location} lastmod should not be in the future`
	)
}

function validateSitemapEntries(entries) {
	assert.equal(
		entries.length,
		EXPECTED_PATHS.length,
		"sitemap.xml should contain the exact public docs URL count"
	)

	const normalized = entries.map(({ location, lastModified }) => {
		validateLastModified(lastModified, location)
		const value = location
		const url = new URL(value)
		assert.equal(url.protocol, "https:", `${value} should use HTTPS`)
		assert.equal(
			url.hostname,
			"monolineui.chitrankagnihotri.com",
			`${value} should use the canonical hostname`
		)
		assert.equal(url.search, "", `${value} should not contain a query string`)
		assert.equal(url.hash, "", `${value} should not contain a fragment`)
		assert.ok(
			url.pathname === "/" || !url.pathname.endsWith("/"),
			`${value} should not contain a trailing slash`
		)
		assert.notEqual(
			url.pathname,
			"/foundations/spacing-motion",
			"the legacy combined foundation route should not be indexed"
		)
		return url.origin + url.pathname
	})

	assert.equal(
		new Set(normalized).size,
		normalized.length,
		"sitemap.xml should not contain duplicate canonical URLs"
	)
	assert.deepEqual(
		normalized.map((value) => new URL(value).pathname).toSorted(),
		EXPECTED_PATHS,
		"sitemap.xml should match the canonical docs route set"
	)
}

function validateInternalLinks(html, pathname) {
	for (const tag of extractTags(html, "a")) {
		const href = getAttribute(tag, "href")?.trim()
		assert.ok(href, `${pathname} should not contain an anchor without an href`)

		if (href.startsWith("#")) continue

		const target = new URL(href, new URL(pathname, `${SITE_URL}/`))
		if (target.origin !== new URL(SITE_URL).origin) continue

		assert.equal(
			target.search,
			"",
			`${pathname} internal link ${href} should not contain a query string`
		)
		assert.ok(
			EXPECTED_PATH_SET.has(target.pathname),
			`${pathname} internal link ${href} should target a canonical sitemap path`
		)
	}
}

function validatePage(html, pathname, expectedSchemaTypes = []) {
	const canonicalUrl = new URL(pathname, `${SITE_URL}/`).href

	assert.equal(
		countElements(html, "main"),
		1,
		`${pathname} should have one main`
	)
	assert.equal(countElements(html, "h1"), 1, `${pathname} should have one h1`)

	assert.equal(
		countElements(html, "title"),
		1,
		`${pathname} should contain exactly one title`
	)
	const title = extractElementText(html, "title")
	assert.ok(
		title.length >= 50 && title.length <= 60,
		`${pathname} title should be 50-60 characters, received ${title.length}`
	)

	const descriptionTags = findElementsByAttribute(
		html,
		"meta",
		"name",
		"description"
	)
	assert.equal(
		descriptionTags.length,
		1,
		`${pathname} should contain exactly one meta description`
	)
	const descriptionTag = descriptionTags[0]
	const description =
		getAttribute(descriptionTag ?? "", "content")?.trim() ?? ""
	assert.ok(
		description.length >= 150 && description.length <= 160,
		`${pathname} description should be 150-160 characters, received ${description.length}`
	)

	const canonicals = findElementsByAttribute(html, "link", "rel", "canonical")
	assert.equal(
		canonicals.length,
		1,
		`${pathname} should contain exactly one canonical link`
	)
	const canonical = canonicals[0]
	assert.ok(canonical, `${pathname} should contain a canonical link`)
	assert.equal(
		new URL(getAttribute(canonical, "href") ?? "").href,
		canonicalUrl,
		`${pathname} should use its public canonical URL`
	)

	const socialImages = []
	for (const [attribute, value] of [
		["property", "og:image"],
		["name", "twitter:image"],
	]) {
		const images = findElementsByAttribute(html, "meta", attribute, value)
		assert.equal(
			images.length,
			1,
			`${pathname} should contain exactly one ${value}`
		)
		const image = images[0]
		const imageValue = getAttribute(image ?? "", "content")?.trim() ?? ""
		assert.ok(imageValue, `${pathname} should contain ${value}`)
		assert.match(
			imageValue,
			/^https:\/\//,
			`${pathname} ${value} should be an absolute HTTPS URL`
		)
		const imageUrl = new URL(imageValue)
		assert.equal(imageUrl.protocol, "https:", `${value} should use HTTPS`)
		assert.equal(
			imageUrl.hostname,
			new URL(SITE_URL).hostname,
			`${value} should use the canonical host`
		)
		socialImages.push(imageUrl.href)
	}

	const openGraphUrls = findElementsByAttribute(
		html,
		"meta",
		"property",
		"og:url"
	)
	assert.equal(
		openGraphUrls.length,
		1,
		`${pathname} should contain exactly one og:url`
	)
	const openGraphUrl = openGraphUrls[0]
	assert.equal(
		new URL(getAttribute(openGraphUrl ?? "", "content") ?? "").href,
		canonicalUrl,
		`${pathname} og:url should match its canonical URL`
	)

	const robots = findElementByAttribute(html, "meta", "name", "robots")
	assert.ok(
		!getAttribute(robots ?? "", "content")
			?.toLowerCase()
			.includes("noindex"),
		`${pathname} should be indexable`
	)

	const jsonLd = extractJsonLd(html)
	if (pathname !== "/") {
		for (const homepageSchemaType of ["WebSite", "SoftwareSourceCode"]) {
			assert.ok(
				!jsonLd.some((entry) => containsSchemaType(entry, homepageSchemaType)),
				`${pathname} should not duplicate homepage ${homepageSchemaType} JSON-LD`
			)
		}
	}
	for (const schemaType of expectedSchemaTypes) {
		assert.ok(
			jsonLd.some((entry) => containsSchemaType(entry, schemaType)),
			`${pathname} should contain ${schemaType} JSON-LD`
		)
	}

	validateInternalLinks(html, pathname)

	return { description, socialImages, title }
}

async function mapWithConcurrency(items, concurrency, mapper) {
	const results = new Array(items.length)
	let nextIndex = 0

	async function worker() {
		while (nextIndex < items.length) {
			const index = nextIndex
			nextIndex += 1
			results[index] = await mapper(items[index], index)
		}
	}

	await Promise.all(
		Array.from({ length: Math.min(concurrency, items.length) }, worker)
	)
	return results
}

async function waitForServer(server) {
	const deadline = Date.now() + STARTUP_TIMEOUT_MS
	let lastError = null

	while (Date.now() < deadline) {
		if (server.exitCode !== null) {
			throw new Error(
				`Next.js exited before becoming ready (${server.exitCode})`
			)
		}

		try {
			const response = await fetchResponse("/robots.txt")
			if (response.status === 200) return
			lastError = new Error(`Readiness endpoint returned ${response.status}`)
		} catch (error) {
			lastError = error
		}

		await new Promise((resolve) => setTimeout(resolve, 200))
	}

	throw new Error(
		`Next.js did not become ready within ${STARTUP_TIMEOUT_MS}ms: ${lastError}`
	)
}

async function stopServer(server) {
	if (server.exitCode !== null) return

	const exited = new Promise((resolve) => server.once("exit", resolve))
	server.kill("SIGTERM")
	const forceKill = setTimeout(() => server.kill("SIGKILL"), 5_000)
	await exited
	clearTimeout(forceKill)
}

async function run() {
	const serverOutput = []
	const server = spawn(
		process.execPath,
		[
			"node_modules/next/dist/bin/next",
			"start",
			"--hostname",
			HOST,
			"--port",
			String(PORT),
		],
		{
			cwd: process.cwd(),
			env: { ...process.env, NODE_ENV: "production" },
			stdio: ["ignore", "pipe", "pipe"],
		}
	)

	for (const stream of [server.stdout, server.stderr]) {
		stream.setEncoding("utf8")
		stream.on("data", (chunk) => serverOutput.push(chunk))
	}

	try {
		await waitForServer(server)

		const [robots, sitemapXml] = await Promise.all([
			fetchText("/robots.txt"),
			fetchText("/sitemap.xml"),
		])
		assert.match(
			robots,
			/#\s+monoline\/ui/i,
			"robots.txt should keep its header"
		)
		assert.match(
			robots,
			/^Sitemap:\s*https:\/\/monolineui\.chitrankagnihotri\.com\/sitemap\.xml\s*$/m,
			"robots.txt should reference the canonical sitemap"
		)

		const sitemapEntries = await getSitemapEntries(sitemapXml)
		validateSitemapEntries(sitemapEntries)
		assert.ok(
			sitemapEntries.length <= EXPECTED_ROUTE_COUNT,
			`the crawl should remain bounded to ${EXPECTED_ROUTE_COUNT} public routes`
		)
		const sitemapUrls = sitemapEntries.map(({ location }) => location)

		const pages = await mapWithConcurrency(
			sitemapUrls,
			CRAWL_CONCURRENCY,
			async (value) => {
				const pathname = new URL(value).pathname
				const html = await fetchText(pathname)
				const metadata = validatePage(
					html,
					pathname,
					pathname === "/" ? ["WebSite", "SoftwareSourceCode"] : []
				)
				console.log(`✓ ${pathname}`)
				return metadata
			}
		)

		assert.equal(
			new Set(pages.map(({ title }) => title)).size,
			pages.length,
			"all sitemap pages should have unique titles"
		)
		assert.equal(
			new Set(pages.map(({ description }) => description)).size,
			pages.length,
			"all sitemap pages should have unique descriptions"
		)

		const imagePaths = [
			...new Set(
				pages.flatMap(({ socialImages }) =>
					socialImages.map((value) => new URL(value).pathname)
				)
			),
		]
		for (const imagePath of imagePaths) {
			const response = await fetchResponse(imagePath)
			assert.equal(response.status, 200, `${imagePath} should return HTTP 200`)
			assert.match(
				response.headers.get("content-type") ?? "",
				/^image\//,
				`${imagePath} should return an image content type`
			)
		}

		const legacy = await fetchResponse("/foundations/spacing-motion")
		assert.ok(
			[301, 308].includes(legacy.status),
			"the legacy foundation route should permanently redirect"
		)
		assert.equal(
			new URL(legacy.headers.get("location") ?? "", SITE_URL).pathname,
			"/foundations/spacing",
			"the legacy foundation route should redirect to spacing"
		)

		const queryHtml = await fetchText("/components/button?theme=dark")
		validatePage(queryHtml, "/components/button")

		console.log(`✓ /robots.txt`)
		console.log(`✓ /sitemap.xml (${sitemapUrls.length} URLs)`)
		console.log("SEO integration checks passed.")
	} catch (error) {
		if (serverOutput.length > 0) {
			console.error(`\nNext.js server output:\n${serverOutput.join("")}`)
		}
		throw error
	} finally {
		await stopServer(server)
	}
}

run().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
