import { JSON_SCHEMA, load } from "js-yaml"
import { readFile, stat } from "node:fs/promises"
import { resolve } from "node:path"

import type { DocumentationPage } from "./content.ts"
import type { NavigationItem } from "./navigation.ts"

type ObjectValue = Record<string, unknown>
const methods = [
	"get",
	"put",
	"post",
	"delete",
	"options",
	"head",
	"patch",
	"trace",
]
const record = (value: unknown): value is ObjectValue =>
	!!value && typeof value === "object" && !Array.isArray(value)
const text = (value: unknown) => (typeof value === "string" ? value : "")
// Descriptions are data, never executable MDX or raw HTML.
const escape = (value: unknown) =>
	text(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/([\\`*_{}[\]()#!|])/g, "\\$1")
const slug = (value: string) =>
	value
		.toLowerCase()
		.replace(/[^a-z0-9_-]+/g, "-")
		.replace(/^-|-$/g, "") || "unnamed"
const fence = (value: string, language = "json") => {
	const length = Math.max(
		3,
		...Array.from(value.matchAll(/`+/g), (m) => m[0].length + 1)
	)
	const marker = "`".repeat(length)
	return `\n${marker}${language}\n${value}\n${marker}\n`
}

/** A local specification becomes ordinary pages in the shared route manifest. */
export function generateOpenApi(
	input: unknown,
	sourcePath: string,
	base: `/${string}`
) {
	const fail = (message: string): never => {
		throw new Error(`${sourcePath}: ${message}`)
	}
	if (!record(input) || !/^3\.(0|1)\.\d+$/.test(text(input.openapi)))
		fail("Expected OpenAPI 3.0 or 3.1")
	const spec = input as ObjectValue
	if (
		!record(spec.info) ||
		!text(spec.info.title) ||
		!text(spec.info.version) ||
		!record(spec.paths)
	)
		fail("info.title, info.version and paths are required")
	const info = spec.info as ObjectValue
	const paths = spec.paths as ObjectValue
	const cache = new Map<string, ObjectValue | boolean>()
	function reference(ref: string): ObjectValue | boolean {
		const known = cache.get(ref)
		if (known !== undefined) return known
		if (!ref.startsWith("#/"))
			return fail(`Only local JSON-pointer references are supported: ${ref}`)
		let current: unknown = spec
		let decoded: string
		try {
			decoded = decodeURIComponent(ref.slice(2))
		} catch {
			return fail(`Invalid reference ${ref}`)
		}
		for (const part of decoded.split("/")) {
			const key = part.replace(/~1/g, "/").replace(/~0/g, "~")
			if (!record(current) || !Object.hasOwn(current, key))
				return fail(`Unresolved reference ${ref}`)
			current = current[key]
		}
		if (
			!record(current) &&
			!(text(spec.openapi).startsWith("3.1.") && typeof current === "boolean")
		)
			return fail(`Reference must identify an object: ${ref}`)
		cache.set(ref, current as ObjectValue | boolean)
		return current as ObjectValue | boolean
	}
	// Validate all references once, including schemas not reached by an operation.
	const visited = new WeakSet<object>()
	const checkedSchemas = new WeakSet<object>()
	let schemaCount = 0
	function validateSchema(value: unknown, depth = 0): void {
		if (typeof value === "boolean" && text(spec.openapi).startsWith("3.1."))
			return
		if (!record(value))
			fail("Invalid schema: expected an object (or a boolean in OpenAPI 3.1)")
		const node = value as ObjectValue
		if (checkedSchemas.has(node)) return
		if (depth > 128 || ++schemaCount > 50000)
			fail("Schema exceeds the supported nesting or object limit")
		checkedSchemas.add(node)
		if (node.$ref !== undefined) {
			if (typeof node.$ref !== "string") fail("Schema $ref must be a string")
			validateSchema(reference(node.$ref as string), depth + 1)
		}
		if (node.type !== undefined) {
			const types = Array.isArray(node.type) ? node.type : [node.type]
			if (
				!types.length ||
				types.some(
					(type) =>
						typeof type !== "string" ||
						![
							"string",
							"number",
							"integer",
							"object",
							"array",
							"boolean",
							"null",
						].includes(type)
				) ||
				(Array.isArray(node.type) && !text(spec.openapi).startsWith("3.1."))
			)
				fail("Invalid schema type")
		}
		for (const key of ["properties", "$defs", "patternProperties"]) {
			if (node[key] === undefined) continue
			if (!record(node[key])) fail(`Schema ${key} must be an object`)
			for (const child of Object.values(node[key] as ObjectValue))
				validateSchema(child, depth + 1)
		}
		for (const key of [
			"items",
			"not",
			"contains",
			"propertyNames",
			"if",
			"then",
			"else",
			"unevaluatedProperties",
			"unevaluatedItems",
		])
			if (node[key] !== undefined) validateSchema(node[key], depth + 1)
		if (
			node.additionalProperties !== undefined &&
			typeof node.additionalProperties !== "boolean"
		)
			validateSchema(node.additionalProperties, depth + 1)
		for (const key of ["allOf", "oneOf", "anyOf", "prefixItems"]) {
			if (node[key] === undefined) continue
			if (!Array.isArray(node[key])) fail(`Schema ${key} must be an array`)
			for (const child of node[key] as unknown[])
				validateSchema(child, depth + 1)
		}
		if (
			node.required !== undefined &&
			(!Array.isArray(node.required) ||
				node.required.some((name) => typeof name !== "string"))
		)
			fail("Schema required must be an array of strings")
		if (node.enum !== undefined && !Array.isArray(node.enum))
			fail("Schema enum must be an array")
	}
	let count = 0
	function validate(value: unknown, depth = 0, context = ""): void {
		// Requirement keys are security-scheme names, not specification fields.
		if (context === "security") return
		if (!value || typeof value !== "object" || visited.has(value)) return
		if (depth > 128 || ++count > 50000)
			fail("Specification exceeds the supported nesting or object limit")
		visited.add(value)
		const dictionaryRoles: Record<string, string> = {
			securitySchemes: "securityScheme",
			parameters: "parameter",
			responses: "response",
			requestBodies: "requestBody",
			headers: "header",
			examples: "exampleObject",
			content: "mediaType",
		}
		const role = dictionaryRoles[context]
		if (role) {
			for (const [name, child] of Object.entries(value))
				if (!name.startsWith("x-")) validate(child, depth + 1, role)
			return
		}
		if (context === "schema") {
			validateSchema(value)
			return
		}
		if (["schemas", "properties", "$defs"].includes(context)) {
			for (const child of Object.values(value)) validateSchema(child)
			return
		}
		if (record(value) && value.$ref !== undefined) {
			if (typeof value.$ref !== "string") fail("$ref must be a string")
			reference(value.$ref as string)
		}
		for (const [key, item] of Object.entries(value)) {
			if (key === "schema") {
				validateSchema(item)
				continue
			}
			// Schema property names can themselves be "example" or "value".
			if (
				context !== "properties" &&
				(key.startsWith("x-") ||
					["example", "default", "enum", "const", "value"].includes(key))
			)
				continue
			validate(item, depth + 1, key)
		}
	}
	validate(spec)
	function dereference(value: unknown, seen = new Set<string>()): ObjectValue {
		if (!record(value)) return fail("Expected an object")
		if (typeof value.$ref !== "string") return value
		if (seen.has(value.$ref))
			return fail(`Circular non-schema reference ${value.$ref}`)
		seen.add(value.$ref)
		return dereference(reference(value.$ref), seen)
	}
	const pages: DocumentationPage[] = []
	const routes = new Set<string>()
	const add = (route: `/${string}`, title: string, source: string) => {
		if (routes.has(route)) fail(`Duplicate generated route ${route}`)
		routes.add(route)
		pages.push({
			filePath: `${resolve(sourcePath)}.monoline${route}.md`,
			format: "md",
			route,
			metadata: { title, layout: "reference" },
			source,
		})
	}
	const components = record(spec.components) ? spec.components : {}
	const schemas = record(components.schemas) ? components.schemas : {}
	if (spec.components !== undefined && !record(spec.components))
		fail("components must be an object")
	if (components.schemas !== undefined && !record(components.schemas))
		fail("components.schemas must be an object")
	for (const [name, value] of Object.entries(schemas))
		if (
			!record(value) &&
			!(text(spec.openapi).startsWith("3.1.") && typeof value === "boolean")
		)
			fail(`Invalid schema ${name}`)
	const schemaRoutes = new Map(
		Object.keys(schemas)
			.sort()
			.map((name) => [name, `${base}/schemas/${slug(name)}` as const])
	)
	const schemaNames = new Map(
		Object.keys(schemas).map((name) => [
			`#/components/schemas/${name.replace(/~/g, "~0").replace(/\//g, "~1")}`,
			name,
		])
	)
	let expansions = 0
	function schema(value: unknown, depth = 0, seen = new Set<object>()): string {
		if (++expansions > 100000)
			fail("Schema expansion exceeds the supported limit")
		if (depth >= 6 || (record(value) && seen.has(value)))
			return "Nested schema (expansion limited)"
		if (typeof value === "boolean" && text(spec.openapi).startsWith("3.1."))
			return value ? "Any value" : "No value"
		if (value === undefined) return "Unspecified"
		if (!record(value))
			return fail(
				"Invalid schema: expected an object (or a boolean in OpenAPI 3.1)"
			)
		if (typeof value.$ref === "string") {
			const name = schemaNames.get(value.$ref)
			if (name) return `[${escape(name)}](${schemaRoutes.get(name)})`
			return schema(reference(value.$ref), depth + 1, seen)
		}
		const next = new Set(seen).add(value)
		const type = Array.isArray(value.type)
			? value.type.map(escape).join(" or ")
			: escape(value.type) || (value.properties ? "object" : "value")
		let result = `${type}${value.nullable === true ? " or null" : ""}${value.description ? ` — ${escape(value.description)}` : ""}`
		if (Array.isArray(value.enum))
			result += `\n\nAllowed values: ${escape(JSON.stringify(value.enum))}`
		if (value.items !== undefined)
			result += `\n\nItems: ${schema(value.items, depth + 1, next)}`
		for (const key of ["allOf", "oneOf", "anyOf"])
			if (Array.isArray(value[key]))
				result += `\n\n${key}: ${value[key].map((item) => schema(item, depth + 1, next)).join("; ")}`
		if (record(value.properties)) {
			const required = Array.isArray(value.required) ? value.required : []
			for (const name of Object.keys(value.properties).sort())
				result += `\n\n- **${escape(name)}**${required.includes(name) ? " (required)" : ""}: ${schema(value.properties[name], depth + 1, next).replace(/\n/g, " ")}`
		}
		if (value.example !== undefined)
			result += fence(JSON.stringify(value.example, null, 2))
		if (Array.isArray(value.examples))
			for (const example of value.examples)
				result += fence(JSON.stringify(example, null, 2))
		return result
	}
	function media(value: unknown): string {
		if (!record(value)) return ""
		return Object.keys(value)
			.sort()
			.map((type) => {
				const item = dereference(value[type])
				let result = `\n\n**${escape(type)}**\n\n${schema(item.schema)}`
				if (item.example !== undefined)
					result += fence(JSON.stringify(item.example, null, 2))
				if (record(item.examples))
					for (const name of Object.keys(item.examples).sort()) {
						const example = dereference(item.examples[name])
						if (example.value !== undefined)
							result += `\n\n${escape(name)}${fence(JSON.stringify(example.value, null, 2))}`
					}
				return result
			})
			.join("\n")
	}
	const groups = new Map<string, NavigationItem[]>()
	const operations: NavigationItem[] = []
	const identifiers = new Set<string>()
	for (const path of Object.keys(paths).sort()) {
		if (path.startsWith("x-")) continue
		if (!path.startsWith("/")) fail(`Invalid path ${path}`)
		const item = dereference(paths[path])
		for (const method of methods) {
			if (item[method] === undefined) continue
			const operation = dereference(item[method])
			if (operation.operationId !== undefined && !text(operation.operationId))
				fail(`${method} ${path}: operationId must be a nonempty string`)
			const identifier = text(operation.operationId) || `${method}-${path}`
			if (identifiers.has(identifier))
				fail(`Duplicate operationId ${identifier}`)
			identifiers.add(identifier)
			if (
				!record(operation.responses) ||
				!Object.keys(operation.responses).length
			)
				fail(`${method.toUpperCase()} ${path}: responses are required`)
			const route = `${base}/operations/${slug(identifier)}` as const
			const title = text(operation.summary) || `${method.toUpperCase()} ${path}`
			let source = `${escape(operation.description)}\n\n**${method.toUpperCase()} ${escape(path)}**${operation.deprecated ? " — Deprecated" : ""}`
			const parameters = new Map<string, ObjectValue>()
			for (const owner of [item, operation]) {
				if (owner.parameters !== undefined && !Array.isArray(owner.parameters))
					fail(`${identifier}: parameters must be an array`)
				for (const value of (owner.parameters ?? []) as unknown[]) {
					const parameter = dereference(value)
					if (
						!text(parameter.name) ||
						!["path", "query", "header", "cookie"].includes(text(parameter.in))
					)
						fail(`${identifier}: invalid parameter`)
					if (parameter.in === "path" && parameter.required !== true)
						fail(`${identifier}: path parameters must be required`)
					parameters.set(`${parameter.in}:${parameter.name}`, parameter)
				}
			}
			if (parameters.size) source += "\n\n## Parameters\n"
			for (const parameter of parameters.values())
				source += `\n\n### ${escape(parameter.name)} (${escape(parameter.in)})\n\n${parameter.required ? "Required. " : "Optional. "}${escape(parameter.description)}\n\n${schema(parameter.schema)}${media(parameter.content)}`
			if (operation.requestBody !== undefined) {
				const body = dereference(operation.requestBody)
				if (!record(body.content))
					fail(`${identifier}: requestBody.content is required`)
				source += `\n\n## Request body\n\n${body.required ? "Required. " : "Optional. "}${escape(body.description)}${media(body.content)}`
			}
			source += "\n\n## Responses\n"
			const responses = operation.responses as ObjectValue
			for (const status of Object.keys(responses).sort()) {
				if (status.startsWith("x-")) continue
				if (!/^(?:[1-5][0-9X]{2}|default)$/.test(status))
					fail(`${identifier}: invalid response status ${status}`)
				const response = dereference(responses[status])
				if (typeof response.description !== "string")
					fail(`${identifier}: response ${status} requires description`)
				source += `\n\n### ${status}\n\n${escape(response.description)}${media(response.content)}`
			}
			let url = `<BASE_URL>${path.replace(/\{([^}]+)\}/g, (_, name: string) => `<${name.toUpperCase().replace(/[^A-Z0-9_]/g, "_")}>`)}`
			const query = [...parameters.values()]
				.filter((p) => p.in === "query")
				.map((p) => `${encodeURIComponent(text(p.name))}=<VALUE>`)
			const quote = (value: string) => `'${value.replace(/'/g, "'\\''")}'`
			const command: string[] = []
			const security = operation.security ?? spec.security
			if (security !== undefined && !Array.isArray(security))
				fail(`${identifier}: security must be an array`)
			if (Array.isArray(security) && security.length) {
				const schemes = record(components.securitySchemes)
					? components.securitySchemes
					: {}
				for (const alternative of security) {
					if (!record(alternative))
						fail(`${identifier}: invalid security requirement`)
					for (const [name, scopes] of Object.entries(
						alternative as ObjectValue
					)) {
						if (!Object.hasOwn(schemes, name))
							fail(`${identifier}: unknown security scheme ${name}`)
						if (
							!Array.isArray(scopes) ||
							scopes.some((scope) => typeof scope !== "string")
						)
							fail(`${identifier}: security scopes must be an array of strings`)
					}
				}
				// Requirements are alternatives; one empty requirement makes auth optional.
				const requirement =
					security.find(
						(value) => record(value) && !Object.keys(value).length
					) ?? security[0]
				if (!record(requirement))
					fail(`${identifier}: invalid security requirement`)
				for (const name of Object.keys(requirement as ObjectValue).sort()) {
					const schemes = record(components.securitySchemes)
						? components.securitySchemes
						: {}
					if (!Object.hasOwn(schemes, name))
						fail(`${identifier}: unknown security scheme ${name}`)
					const scheme = dereference(schemes[name])
					if (scheme.type === "apiKey") {
						if (!text(scheme.name))
							fail(`${identifier}: apiKey name is required`)
						if (scheme.in === "query")
							query.push(`${encodeURIComponent(text(scheme.name))}=<API_KEY>`)
						else if (scheme.in === "header")
							command.push(
								`  --header ${quote(`${text(scheme.name)}: <API_KEY>`)}`
							)
						else if (scheme.in === "cookie")
							command.push(
								`  --cookie ${quote(`${text(scheme.name)}=<API_KEY>`)}`
							)
						else fail(`${identifier}: invalid apiKey location`)
					} else if (
						scheme.type === "http" &&
						text(scheme.scheme).toLowerCase() === "basic"
					)
						command.push("  --user '<USERNAME>:<PASSWORD>'")
					else if (
						(scheme.type === "http" &&
							text(scheme.scheme).toLowerCase() === "bearer") ||
						["oauth2", "openIdConnect"].includes(text(scheme.type))
					)
						command.push("  --header 'Authorization: Bearer <TOKEN>'")
					else if (scheme.type === "mutualTLS")
						command.push("  --cert '<CLIENT_CERT>' --key '<CLIENT_KEY>'")
					else fail(`${identifier}: unsupported security scheme ${name}`)
				}
			}
			if (query.length) url += `?${query.join("&")}`
			command.unshift(`curl --request ${method.toUpperCase()} ${quote(url)}`)
			for (const parameter of parameters.values())
				if (parameter.in === "header")
					command.push(
						`  --header ${quote(`${text(parameter.name)}: <VALUE>`)}`
					)
			for (const parameter of parameters.values())
				if (parameter.in === "cookie")
					command.push(`  --cookie ${quote(`${text(parameter.name)}=<VALUE>`)}`)
			if (operation.requestBody)
				command.push(
					"  --header 'Content-Type: <MEDIA_TYPE>'",
					"  --data '<REQUEST_BODY>'"
				)
			source += `\n\n## Request example\n\nReplace the explicit placeholders with your API URL and values. Credentials are never populated automatically.${fence(command.join(" \\\n"), "sh")}`
			add(route, title, source)
			const entry = { label: title, href: route }
			operations.push(entry)
			const tags = operation.tags
			if (
				tags !== undefined &&
				(!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string"))
			)
				fail(`${identifier}: tags must be strings`)
			const tag =
				Array.isArray(tags) && tags.length ? text(tags[0]) : "Operations"
			if (!groups.has(tag)) groups.set(tag, [])
			groups.get(tag)!.push(entry)
		}
	}
	for (const [name, route] of schemaRoutes)
		add(route, name, `## Schema\n\n${schema(schemas[name])}`)
	add(
		base,
		text(info.title),
		`${escape(info.description)}\n\nVersion: ${escape(info.version)}\n\n## Operations\n\n${operations.map((entry) => `- [${escape(entry.label)}](${"href" in entry ? entry.href : ""})`).join("\n")}\n\n## Schemas\n\n${[...schemaRoutes].map(([name, route]) => `- [${escape(name)}](${route})`).join("\n")}`
	)
	pages.sort((a, b) => a.route.localeCompare(b.route))
	const navigation: NavigationItem[] = [
		{ label: text(info.title), href: base },
		...[...groups]
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([label, items]) => ({ label, items })),
		...(schemaRoutes.size
			? [
					{
						label: "Schemas",
						items: [...schemaRoutes].map(([label, href]) => ({ label, href })),
					},
				]
			: []),
	]
	return { pages, navigation }
}

export async function loadOpenApi(file: string, base: `/${string}`) {
	const path = resolve(file)
	try {
		if ((await stat(path)).size > 10 * 1024 * 1024)
			throw new Error("Specification exceeds the supported 10 MiB file limit")
		const source = await readFile(path, "utf8")
		return {
			...generateOpenApi(
				load(source, { schema: JSON_SCHEMA, filename: path }),
				path,
				base
			),
			dependency: path,
		}
	} catch (error) {
		throw new Error(
			`OpenAPI ${path}: ${error instanceof Error ? error.message : String(error)}`,
			{ cause: error }
		)
	}
}
