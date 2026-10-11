import { buildDocs } from "@chitrank2050/monoline-docs/build"
import { readFile, readdir, writeFile } from "node:fs/promises"
import { join } from "node:path"

import config from "./config.mjs"

const beaconToken =
	process.env.VERCEL_ENV === "production"
		? process.env.CLOUDFLARE_WEB_ANALYTICS_TOKEN
		: undefined
if (beaconToken !== undefined && !/^[a-f0-9]{32}$/i.test(beaconToken))
	throw new Error(
		"CLOUDFLARE_WEB_ANALYTICS_TOKEN must be a 32-character hexadecimal beacon token"
	)

const result = await buildDocs(config)
if (config.site && config.indexing !== false) {
	// Share our website's identity snapshot without making builds depend on its availability.
	const identity = JSON.parse(
		await readFile(
			new URL("../website/public/identity.json", import.meta.url),
			"utf8"
		)
	)
	const person = {
		"@context": "https://schema.org",
		"@type": "Person",
		"@id": new URL("/#person", identity.websiteUrl).href,
		name: identity.name,
		url: identity.websiteUrl,
		sameAs: [identity.socials.github, identity.socials.linkedin],
	}
	const creator = { "@id": person["@id"] }
	const packageInfo = JSON.parse(
		await readFile(
			new URL("../../packages/docs/package.json", import.meta.url),
			"utf8"
		)
	)
	const homepageUrl = new URL(config.base ?? "/", config.site).href
	const product = {
		"@context": "https://schema.org",
		"@type": "SoftwareSourceCode",
		"@id": `${homepageUrl}#monoline-docs`,
		name: "Monoline Docs",
		alternateName: packageInfo.name,
		description: packageInfo.description,
		url: homepageUrl,
		mainEntityOfPage: { "@id": `${homepageUrl}#page` },
		codeRepository:
			"https://github.com/chitranklabs/monoline-ui/tree/main/packages/docs",
		license: "https://github.com/chitranklabs/monoline-ui/blob/main/LICENSE",
		version: packageInfo.version,
		programmingLanguage: "TypeScript",
		runtimePlatform: `Node.js ${packageInfo.engines.node}`,
		sameAs: ["https://www.npmjs.com/package/@chitrank2050/monoline-docs"],
		isAccessibleForFree: true,
		creator,
	}
	for (const file of await readdir(result.outDirectory, { recursive: true })) {
		if (!file.endsWith(".html")) continue
		const filePath = join(result.outDirectory, file)
		const html = await readFile(filePath, "utf8")
		if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue
		const updated = html.replace(
			/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
			(_match, source) => {
				const entity = JSON.parse(source)
				if (entity["@type"] === "WebSite") entity.publisher = creator
				if (["Article", "TechArticle"].includes(entity["@type"]))
					entity.author = creator
				return `<script type="application/ld+json">${JSON.stringify(entity).replaceAll("<", "\\u003c")}</script>`
			}
		)
		await writeFile(
			filePath,
			updated.replace(
				"</head>",
				`<script type="application/ld+json">${JSON.stringify(person).replaceAll("<", "\\u003c")}</script></head>`
			)
		)
	}
	const homepage = join(result.outDirectory, "index.html")
	const html = await readFile(homepage, "utf8")
	await writeFile(
		homepage,
		html.replace(
			"</head>",
			`<script type="application/ld+json">${JSON.stringify(product).replaceAll("<", "\\u003c")}</script></head>`
		)
	)
}
if (beaconToken) {
	// Instrument our hosted site only; the published package and local preview remain independent.
	const beacon = `<script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='${JSON.stringify({ token: beaconToken })}'></script>`
	for (const file of await readdir(result.outDirectory, { recursive: true })) {
		if (!file.endsWith(".html")) continue
		const filePath = join(result.outDirectory, file)
		const html = await readFile(filePath, "utf8")
		await writeFile(filePath, html.replace("</body>", `${beacon}</body>`))
	}
}
console.log(`Built ${result.pages} pages in ${result.outDirectory}`)
