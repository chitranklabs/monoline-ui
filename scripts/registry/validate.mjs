import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { registrySchema } from "shadcn/schema"

const projectRoot = path.resolve(import.meta.dirname, "../..")
const registryPath = path.join(projectRoot, "registry.json")
const registry = registrySchema.parse(
	JSON.parse(await readFile(registryPath, "utf8"))
)
const names = registry.items.map((item) => item.name)

assert.deepEqual(
	names,
	[...names].sort(),
	"Registry items must stay alphabetical"
)
assert.equal(
	new Set(names).size,
	names.length,
	"Registry item names must be unique"
)
assert.equal(
	names.length,
	5,
	"The first registry wave must contain five blocks"
)

for (const item of registry.items) {
	assert.equal(item.type, "registry:block", `${item.name} must be a block`)
	assert.ok(item.title, `${item.name} needs a human-readable title`)
	assert.ok(item.description, `${item.name} needs a useful description`)
	assert.ok(
		item.meta?.seoDescription?.length >= 150 &&
			item.meta.seoDescription.length <= 160,
		`${item.name} needs a 150-160 character SEO description`
	)
	assert.ok(
		item.files.length > 0,
		`${item.name} must install at least one file`
	)
	assert.ok(
		item.dependencies?.some((dependency) =>
			dependency.startsWith("@chitrank2050/monoline-ui@")
		),
		`${item.name} must declare its Monoline package dependency`
	)

	for (const file of item.files) {
		assert.equal(file.type, "registry:component")
		assert.ok(
			file.target?.startsWith("@components/monoline/"),
			`${item.name} must install below the configured components directory`
		)
		const source = await readFile(path.join(projectRoot, file.path), "utf8")
		assert.doesNotMatch(source, /^\s*["']use client["']/m)
		assert.doesNotMatch(
			source,
			/(?:from|import\()\s*["'](?:@\/|\.\.\/\.\.\/app)/
		)
		assert.match(source, /@chitrank2050\/monoline-ui\//)
	}
}

console.log(`Validated ${names.length} registry blocks: ${names.join(", ")}`)
