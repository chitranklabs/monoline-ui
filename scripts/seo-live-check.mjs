import { appendFile } from "node:fs/promises"
import { pathToFileURL } from "node:url"

export const sites = [
	["portfolio", "https://chitrankagnihotri.com"],
	["monoline-ui", "https://monolineui.chitrankagnihotri.com"],
	["monoline-docs", "https://monolinedocs.chitrankagnihotri.com"],
	["git-hygiene", "https://githygiene.chitrankagnihotri.com"],
	["git-hygiene-docs", "https://docs.githygiene.chitrankagnihotri.com"],
	["ask-widget", "https://askwidget.chitrankagnihotri.com"],
	["ask-widget-docs", "https://docs.askwidget.chitrankagnihotri.com"],
]

async function read(url, fetchImpl) {
	let failure
	for (let attempt = 0; attempt < 2; attempt++) {
		const signal = AbortSignal.timeout(10_000)
		try {
			let current = url
			for (let hop = 0; hop < 4; hop++) {
				const response = await fetchImpl(current, {
					redirect: "manual",
					signal,
				})
				if ([301, 302, 303, 307, 308].includes(response.status)) {
					await response.body?.cancel()
					const destination = new URL(
						response.headers.get("location") ?? "",
						current
					)
					if (destination.origin !== new URL(url).origin)
						throw new Error("Unexpected redirect or HTTPS downgrade")
					current = destination.href
					continue
				}
				if (response.status !== 200) {
					await response.body?.cancel()
					throw new Error(`HTTP ${response.status}`)
				}
				const chunks = []
				let size = 0
				for await (const chunk of response.body ?? []) {
					size += chunk.byteLength
					if (size > 1_048_576) throw new Error("Response exceeds 1 MiB")
					chunks.push(Buffer.from(chunk))
				}
				return {
					body: Buffer.concat(chunks).toString("utf8"),
					headers: response.headers,
				}
			}
			throw new Error("Redirect limit exceeded")
		} catch (error) {
			failure = error
		}
	}
	throw failure
}

export async function checkSite(origin, fetchImpl = fetch) {
	if (new URL(origin).protocol !== "https:")
		throw new Error("HTTPS is required")
	const paths = ["/", "/robots.txt", "/sitemap.xml"]
	const errors = await Promise.all(
		paths.map(async (path) => {
			try {
				const { body, headers } = await read(`${origin}${path}`, fetchImpl)
				if (path === "/") {
					if (!headers.get("content-type")?.includes("text/html"))
						throw new Error("Homepage is not HTML")
					const links =
						body.replace(/<!--[\s\S]*?-->/g, "").match(/<link\b[^>]*>/gi) ?? []
					const canonical = links.filter((tag) =>
						/\srel\s*=\s*["']canonical["']/i.test(tag)
					)
					const href = canonical[0]?.match(
						/\shref\s*=\s*["']([^"']+)["']/i
					)?.[1]
					if (
						canonical.length !== 1 ||
						!href ||
						new URL(href).href !== `${origin}/`
					)
						throw new Error("Homepage canonical is incorrect")
				} else if (path === "/robots.txt") {
					if (
						!body
							.split(/\r?\n/)
							.some(
								(line) =>
									line.trim().toLowerCase() ===
									`sitemap: ${origin}/sitemap.xml`.toLowerCase()
							)
					)
						throw new Error("robots.txt is missing its sitemap reference")
				} else if (
					!/<(urlset|sitemapindex)\b[^>]*>[\s\S]*<\/\1\s*>/i.test(body) ||
					!body.includes(`<loc>${origin}/`)
				)
					throw new Error("Sitemap is missing or uses a different origin")
				return null
			} catch (error) {
				return `${path}: ${error.message}${error.cause?.code ? ` (${error.cause.code})` : ""}`
			}
		})
	)
	return errors.filter(Boolean)
}

export async function main() {
	const rows = []
	for (const [name, origin] of sites) {
		const errors = await checkSite(origin)
		console.log(`${name}: ${errors.length ? errors.join("; ") : "healthy"}`)
		rows.push(`| ${name} | ${errors.length ? "Failed (see log)" : "Passed"} |`)
		if (errors.length) process.exitCode = 1
	}
	if (process.env.GITHUB_STEP_SUMMARY)
		await appendFile(
			process.env.GITHUB_STEP_SUMMARY,
			`## Live site health\n\n| Site | Result |\n|---|---|\n${rows.join("\n")}\n\nChecks HTTPS, homepage canonical, robots.txt and sitemap availability. Build-time SEO tests remain authoritative for page-level checks. This does not measure Google indexing or growth.\n`
		)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
	await main()
