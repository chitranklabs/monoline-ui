import assert from "node:assert/strict"
import { test } from "node:test"

import { checkSite } from "./seo-live-check.mjs"

const origin = "https://example.com"
const fixtures = {
	"/": `<html><link rel="canonical" href="${origin}/"></html>`,
	"/robots.txt": `User-agent: *\nSitemap: ${origin}/sitemap.xml`,
	"/sitemap.xml": `<urlset><url><loc>${origin}/</loc></url></urlset>`,
}
const healthyFetch = async (url) =>
	new Response(fixtures[new URL(url).pathname], {
		headers: { "content-type": "text/html" },
	})

test("checks a healthy homepage, robots and sitemap", async () => {
	assert.deepEqual(await checkSite(origin, healthyFetch), [])
})

test("reports TLS errors and retries each endpoint only once", async () => {
	let calls = 0
	const errors = await checkSite(origin, async () => {
		calls++
		throw new Error("fetch failed", { cause: { code: "CERT_HAS_EXPIRED" } })
	})
	assert.equal(calls, 6)
	assert.equal(errors.length, 3)
	assert.ok(errors.every((error) => error.includes("CERT_HAS_EXPIRED")))
})

test("detects incorrect canonicals and missing robots or sitemap", async () => {
	const errors = await checkSite(origin, async (url) => {
		if (url.endsWith("robots.txt"))
			return new Response("missing", { status: 404 })
		return new Response("<html>missing</html>", {
			headers: { "content-type": "text/html" },
		})
	})
	assert.equal(errors.length, 3)
	assert.match(errors.join("\n"), /canonical.*\n.*HTTP 404.*\n.*Sitemap/)
})

test("rejects cross-origin redirects and HTTPS downgrades without following them", async () => {
	for (const destination of ["http://example.com/", "https://other.example/"]) {
		const errors = await checkSite(origin, async (url) => {
			assert.ok(url.startsWith(origin))
			return new Response(null, {
				status: 302,
				headers: { location: destination },
			})
		})
		assert.ok(errors.every((error) => error.includes("Unexpected redirect")))
	}
})

test("bounds redirect loops and oversized responses", async () => {
	let calls = 0
	const signals = new Set()
	const errors = await checkSite(origin, async (_url, options) => {
		calls++
		signals.add(options.signal)
		return new Response(null, { status: 302, headers: { location: "/" } })
	})
	assert.equal(calls, 24)
	assert.equal(signals.size, 6, "redirects share the timeout of their attempt")
	assert.ok(errors.every((error) => error.includes("Redirect limit")))
	const oversized = await checkSite(
		origin,
		async () => new Response("x".repeat(1_048_577))
	)
	assert.ok(oversized.every((error) => error.includes("1 MiB")))
})

test("ignores commented canonicals, permits attribute spacing and rejects truncated sitemaps", async () => {
	const valid = await checkSite(origin, async (url) =>
		url === `${origin}/`
			? new Response(`<link rel = "canonical" href = "${origin}/">`, {
					headers: { "content-type": "text/html" },
				})
			: healthyFetch(url)
	)
	assert.deepEqual(valid, [])
	const invalid = await checkSite(origin, async (url) => {
		if (url === `${origin}/`)
			return new Response(`<!-- ${fixtures["/"]} -->`, {
				headers: { "content-type": "text/html" },
			})
		if (url.endsWith("sitemap.xml"))
			return new Response(`<urlset><loc>${origin}/`)
		return healthyFetch(url)
	})
	assert.equal(invalid.length, 2)
})
