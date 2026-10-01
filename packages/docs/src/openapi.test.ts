// @vitest-environment node
import { describe, expect, it } from "vitest"

import { generateOpenApi } from "./openapi"

const spec = {
	openapi: "3.1.0",
	info: { title: "Pets", version: "1" },
	paths: {
		"/pets/{id}": {
			get: {
				operationId: "getPet",
				tags: ["Pets"],
				parameters: [
					{
						name: "id",
						in: "path",
						required: true,
						schema: { type: "string" },
					},
				],
				responses: {
					"200": {
						description: "Found",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Pet" },
								example: { id: "one" },
							},
						},
					},
				},
			},
		},
	},
	components: {
		schemas: {
			Pet: {
				type: "object",
				properties: {
					id: { type: "string" },
					parent: { $ref: "#/components/schemas/Pet" },
				},
			},
		},
	},
}
describe("OpenAPI reference generation", () => {
	it("generates stable operations and bounded recursive schema links", () => {
		const result = generateOpenApi(spec, "pets.yml", "/api")
		expect(result.pages.map((p) => p.route)).toEqual([
			"/api",
			"/api/operations/getpet",
			"/api/schemas/pet",
		])
		expect(result.pages[1]!.source).toContain("/api/schemas/pet")
		expect(result.pages[1]!.source).toContain("<ID>")
		expect(result.pages[2]!.source.length).toBeLessThan(4000)
		expect(result.navigation).toEqual(
			expect.arrayContaining([expect.objectContaining({ label: "Pets" })])
		)
		expect(
			generateOpenApi(
				{ ...spec, openapi: "3.0.3" },
				"pets.yml",
				"/api"
			).pages.map((p) => p.route)
		).toEqual(result.pages.map((p) => p.route))
	})
	it.each(["2.0", "3.2.0"])(
		"rejects unsupported version %s with source context",
		(openapi) => {
			expect(() =>
				generateOpenApi({ ...spec, openapi }, "pets.yml", "/api")
			).toThrow(/pets.yml.*3.0.*3.1/)
		}
	)
	it("rejects unresolved and remote references", () => {
		for (const ref of ["https://example.com/spec.json", "#/missing"]) {
			expect(() =>
				generateOpenApi(
					{ ...spec, components: { schemas: { Pet: { $ref: ref } } } },
					"pets.yml",
					"/api"
				)
			).toThrow(/pets.yml/)
		}
	})
	it("rejects duplicate operation identifiers and normalized routes", () => {
		expect(() =>
			generateOpenApi(
				{
					...spec,
					paths: {
						"/one": spec.paths["/pets/{id}"],
						"/two": spec.paths["/pets/{id}"],
					},
				},
				"pets.yml",
				"/api"
			)
		).toThrow(/Duplicate/)
	})
	it("escapes supplied descriptions rather than executing markup", () => {
		const result = generateOpenApi(
			{
				...spec,
				info: {
					title: "Pets",
					version: "1",
					description: "<script>alert(1)</script>",
				},
			},
			"pets.yml",
			"/api"
		)
		expect(result.pages[0]!.source).not.toContain("<script>")
	})
})

it("bounds recursive inline references that are not named component schemas", () => {
	const result = generateOpenApi(
		{
			...spec,
			components: { schemas: { Pet: { $ref: "#/$defs/node" } } },
			$defs: { node: { $ref: "#/$defs/node" } },
		},
		"recursive.yml",
		"/api"
	)
	expect(
		result.pages.find((page) => page.route === "/api/schemas/pet")!.source
	).toContain("expansion limited")
})

it("uses credential placeholders matching the declared authentication mechanism", () => {
	for (const [definition, expected] of [
		[{ type: "apiKey", name: "X-Key", in: "header" }, "X-Key: <API_KEY>"],
		[{ type: "apiKey", name: "key", in: "query" }, "key=<API_KEY>"],
		[{ type: "apiKey", name: "key", in: "cookie" }, "key=<API_KEY>"],
		[{ type: "http", scheme: "basic" }, "<USERNAME>:<PASSWORD>"],
		[{ type: "http", scheme: "bearer" }, "Bearer <TOKEN>"],
	] as const) {
		const input = {
			...spec,
			security: [{ auth: [] }],
			components: { ...spec.components, securitySchemes: { auth: definition } },
		}
		const result = generateOpenApi(input, "auth.yml", "/api")
		expect(
			result.pages.find((page) => page.route.includes("operations"))!.source
		).toContain(expected)
	}
})

it.each([
	{},
	{ ...spec, paths: { "/bad": { get: { responses: { "200": {} } } } } },
	{ ...spec, components: { schemas: { Pet: 42 } } },
])("rejects invalid structures", (input) => {
	expect(() => generateOpenApi(input, "invalid.yml", "/api")).toThrow(
		/invalid.yml/
	)
})

it("keeps literal reference keys in example payloads as data", () => {
	const input = structuredClone(spec)
	input.paths["/pets/{id}"].get.responses["200"].content[
		"application/json"
	].example = { $ref: "customer-id" } as never
	expect(
		generateOpenApi(input, "examples.yml", "/api").pages[1]!.source
	).toContain("customer-id")
})
it("supports referenced boolean schemas in OpenAPI 3.1", () => {
	const result = generateOpenApi(
		{
			...spec,
			components: {
				schemas: {
					...spec.components.schemas,
					Never: false,
					Alias: { $ref: "#/components/schemas/Never" },
				},
			},
		},
		"boolean.yml",
		"/api"
	)
	expect(
		result.pages.find((page) => page.route === "/api/schemas/alias")!.source
	).toContain("/api/schemas/never")
})
it("rejects malformed inline schemas", () => {
	const input = structuredClone(spec)
	input.paths["/pets/{id}"].get.parameters[0]!.schema = 42 as never
	expect(() => generateOpenApi(input, "invalid.yml", "/api")).toThrow(
		/Invalid schema/
	)
})
it("validates unselected security alternatives", () => {
	expect(() =>
		generateOpenApi(
			{ ...spec, security: [{}, { missing: [] }] },
			"security.yml",
			"/api"
		)
	).toThrow(/unknown security scheme/)
})
it("permits extensions in Paths and Responses objects", () => {
	const input = structuredClone(spec)
	Object.assign(input.paths, { "x-label": "API" })
	Object.assign(input.paths["/pets/{id}"].get.responses, {
		"x-label": "Results",
	})
	expect(generateOpenApi(input, "extensions.yml", "/api").pages).toHaveLength(3)
})

it("allows schema example payloads and properties named $ref", () => {
	const result = generateOpenApi(
		{
			...spec,
			components: {
				schemas: {
					...spec.components.schemas,
					Payload: {
						type: "object",
						examples: [{ $ref: "customer-id" }],
						properties: { $ref: { type: "string" } },
					},
				},
			},
		},
		"data.yml",
		"/api"
	)
	expect(
		result.pages.find((page) => page.route === "/api/schemas/payload")!.source
	).toContain("$ref")
})
it("validates schemas past the display depth limit", () => {
	let nested: unknown = 42
	for (let i = 0; i < 10; i++)
		nested = { type: "object", properties: { child: nested } }
	expect(() =>
		generateOpenApi(
			{
				...spec,
				components: { schemas: { ...spec.components.schemas, Bad: nested } },
			},
			"deep.yml",
			"/api"
		)
	).toThrow(/Invalid schema/)
})
it("renders false array item schemas", () => {
	const result = generateOpenApi(
		{
			...spec,
			components: {
				schemas: {
					...spec.components.schemas,
					Empty: { type: "array", items: false },
				},
			},
		},
		"array.yml",
		"/api"
	)
	expect(
		result.pages.find((page) => page.route === "/api/schemas/empty")!.source
	).toContain("Items: No value")
})

it("renders referenced request bodies and response examples", () => {
	const result = generateOpenApi(
		{
			...spec,
			paths: {
				"/pets": {
					post: {
						operationId: "createPet",
						requestBody: { $ref: "#/components/requestBodies/Pet" },
						responses: { "201": { $ref: "#/components/responses/Created" } },
					},
				},
			},
			components: {
				...spec.components,
				requestBodies: {
					Pet: {
						required: true,
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Pet" },
								examples: { pet: { value: { id: "sample" } } },
							},
						},
					},
				},
				responses: {
					Created: {
						description: "Created",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Pet" },
							},
						},
					},
				},
			},
		},
		"body.yml",
		"/api"
	)
	const page = result.pages.find((page) => page.route.includes("operations"))!
	expect(page.source).toContain("## Request body")
	expect(page.source).toContain('"id": "sample"')
	expect(page.source).toContain("--data '<REQUEST_BODY>'")
	expect(page.source).toContain("### 201")
})

it("distinguishes named component dictionaries and security requirements from schema fields", () => {
	const input = {
		...spec,
		security: [{ schema: [] }],
		components: {
			...spec.components,
			securitySchemes: { schema: { type: "http", scheme: "bearer" } },
		},
	}
	expect(
		generateOpenApi(input, "named.yml", "/api").pages[1]!.source
	).toContain("Bearer <TOKEN>")
})
