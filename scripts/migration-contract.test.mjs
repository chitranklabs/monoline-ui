import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"

import { componentSlugs, siteRoutes } from "../app/lib/routes.ts"

// Deliberately independent of sync-exports and metadata.json. A generator must
// not be able to redefine the migration baseline by changing its own outputs.
const components =
	`action-rail avatar back-link badge button callout card changelog checkbox code-block command-search container data-list dialog dropdown-menu editorial-line eyebrow field footer input label link-list media-frame meta-row metric navbar popover progress pull-quote radio-group rail resources-panel section-head segmented-control select separator skeleton status tag testimonial testimonial-grid textarea theme-switcher toast toc toggle tooltip`.split(
		" "
	)
const root = new URL("../", import.meta.url)
const readJson = (file) => JSON.parse(readFileSync(new URL(file, root), "utf8"))
const manifest = readJson("package.json.lib")

test("migration preserves npm identity, peer compatibility and CSS side effects", () => {
	assert.equal(manifest.name, "@chitrank2050/monoline-ui")
	assert.equal(manifest.type, "module")
	assert.deepEqual(manifest.peerDependencies, {
		react: "^18.2.0 || ^19.0.0",
		"react-dom": "^18.2.0 || ^19.0.0",
		tailwindcss: ">=4.0.0",
	})
	assert.deepEqual(manifest.peerDependenciesMeta, {
		tailwindcss: { optional: true },
	})
	assert.deepEqual(manifest.sideEffects, ["./styles/theme.css"])
})

test("migration preserves every existing npm export and target", () => {
	const expected = { ".": { types: "./index.d.ts", import: "./index.js" } }
	for (const name of components) {
		expected[`./${name}`] = {
			types: `./components/${name}/index.d.ts`,
			import: `./components/${name}/index.js`,
		}
	}
	expected["./components/*"] = {
		types: "./components/*/index.d.ts",
		import: "./components/*/index.js",
	}
	for (const dir of ["foundations", "lib"]) {
		expected[`./${dir}/*`] = {
			types: `./${dir}/*.d.ts`,
			import: `./${dir}/*.js`,
		}
	}
	for (const css of ["./theme.css", "./styles/theme.css"]) {
		expected[css] = {
			style: "./styles/theme.css",
			default: "./styles/theme.css",
		}
	}
	expected["./package.json"] = "./package.json"
	assert.deepEqual(manifest.exports, expected)
})

test("migration preserves JSR identity and component subpaths", () => {
	const jsr = readJson("jsr.json")
	assert.equal(jsr.name, manifest.name)
	assert.equal(jsr.version, manifest.version)
	assert.deepEqual(jsr.exports, {
		".": "./src/index.ts",
		...Object.fromEntries(
			components.map((name) => [
				`./${name}`,
				`./src/components/${name}/index.ts`,
			])
		),
	})
})

test("migration preserves the 62 public site routes", () => {
	assert.deepEqual([...componentSlugs], components)
	const pages = [
		"/",
		"/docs",
		"/docs/installation",
		"/docs/accessibility",
		"/docs/theming",
		"/docs/compatibility",
		"/docs/patterns",
		"/docs/foundations",
		"/docs/foundations/colors",
		"/docs/foundations/typography",
		"/docs/foundations/spacing",
		"/docs/foundations/radius",
		"/docs/foundations/motion",
		"/docs/components",
		"/docs/changelog",
	]
	assert.deepEqual(
		[...siteRoutes].sort(),
		[...pages, ...components.map((name) => `/docs/components/${name}`)].sort()
	)
})
