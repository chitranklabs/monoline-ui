import { load } from "js-yaml"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import picomatch from "picomatch"

const root = new URL("../", import.meta.url)
const readWorkflow = (name) =>
	load(readFileSync(new URL(`.github/workflows/${name}.yml`, root), "utf8"))
const ci = readWorkflow("ci")
const filterStep = ci.jobs.changes.steps.find((step) => step.id === "filter")
const filters = load(filterStep.with.filters)

// Match paths with the same library and dot-file option as dorny/paths-filter.
// Read the production YAML rather than maintaining a second list of patterns.
function classify(paths) {
	return Object.fromEntries(
		Object.entries(filters).map(([name, patterns]) => [
			name,
			paths.some((file) => picomatch(patterns, { dot: true })(file)),
		])
	)
}

function applicable(condition, changes) {
	if (!condition) return true
	return condition
		.trim()
		.split(/\s*\|\|\s*/)
		.map((clause) => {
			const match = /^needs\.changes\.outputs\.(\w+) == 'true'$/.exec(clause)
			assert.ok(match, `Unsupported condition: ${clause}`)
			assert.ok(Object.hasOwn(changes, match[1]), `Unknown filter: ${match[1]}`)
			return changes[match[1]]
		})
		.some(Boolean)
}

function selected(paths) {
	const changes = classify(paths)
	const quality = applicable(ci.jobs.quality.if, changes)
	const stepEnabled = (run) => {
		const step = ci.jobs.quality.steps.find((step) => step.run === run)
		assert.ok(step, `Missing quality step: ${run}`)
		return quality && applicable(step.if, changes)
	}
	return {
		quality,
		package: applicable(ci.jobs.package_contract.if, changes),
		docs: applicable(ci.jobs.docs_integration.if, changes),
		types: stepEnabled("pnpm typecheck"),
		unit: stepEnabled("pnpm test"),
	}
}

const full = {
	quality: true,
	package: true,
	docs: true,
	types: true,
	unit: true,
}
const prose = {
	quality: true,
	package: false,
	docs: false,
	types: false,
	unit: false,
}
const docs = { ...full, package: false }
const cases = [
	["root Markdown", ["README.md"], prose],
	["nested Markdown", ["docs/contributing/review.md"], prose],
	["multiple prose files", ["README.md", "CONTRIBUTING.md"], prose],
	["PR template", [".github/PULL_REQUEST_TEMPLATE.md"], prose],
	["format config", [".prettierrc.json"], prose],
	["library component", ["src/components/button/root.tsx"], full],
	["theme tokens", ["src/foundations/theme/tokens.css"], full],
	["shared TypeScript config", ["tsconfig.json"], full],
	["package TypeScript config", ["tsconfig.build.json"], full],
	["CI workflow", [".github/workflows/ci.yml"], full],
	[
		"release validation workflow",
		[".github/workflows/release-finalize.yml"],
		full,
	],
	["dependency lockfile", ["pnpm-lock.yaml"], full],
	["dependency install policy", ["pnpm-workspace.yaml"], full],
	["package scripts", ["package.json"], full],
	["package manifest", ["package.json.lib"], full],
	["playground page", ["app/docs/page.tsx"], docs],
	["browser tests", ["e2e/accessibility.spec.ts"], docs],
	["browser config", ["playwright.config.ts"], docs],
	["Next type environment", ["next-env.d.ts"], docs],
	[
		"build script tests",
		["scripts/ci-workflows.test.mjs"],
		{ ...docs, docs: false },
	],
	["test-runner config", ["vitest.config.ts"], { ...docs, docs: false }],
	[
		"mixed prose and code",
		["README.md", "src/components/button/root.tsx"],
		full,
	],
	// Deleted paths and both sides of renames must still be classified.
	["removed component", ["src/components/removed/index.ts"], full],
	["renamed source", ["src/old.ts", "src/new.ts"], full],
]

for (const [name, paths, expected] of cases) {
	test(`CI selection: ${name}`, () =>
		assert.deepEqual(selected(paths), expected))
}

test("workflow and composite-action changes always select Zizmor", () => {
	for (const file of [
		".github/workflows/ci.yml",
		".github/actions/setup-bot/action.yml",
	]) {
		assert.equal(
			applicable(ci.jobs.workflow_security.if, classify([file])),
			true
		)
	}
	assert.equal(
		applicable(ci.jobs.workflow_security.if, classify(["README.md"])),
		false
	)
})

test("pull requests always report the required gate; push ignores remain", () => {
	assert.equal(ci.on.pull_request.paths, undefined)
	assert.equal(ci.on.pull_request["paths-ignore"], undefined)
	assert.ok(ci.on.push["paths-ignore"].includes("**.md"))
	assert.equal(ci.jobs.ci_gate.name, "CI Gate 🚦")
	assert.equal(ci.jobs.ci_gate.if, "always()")
	for (const job of [
		"changes",
		"quality",
		"package_contract",
		"docs_integration",
		"dependency_scan",
		"secret_scan",
		"workflow_security",
	]) {
		assert.ok(ci.jobs.ci_gate.needs.includes(job), `Gate must require ${job}`)
	}
	assert.equal(ci.jobs.secret_scan.if, undefined)
})

test("prose changes keep cheap checks without running ESLint", () => {
	const changes = classify(["README.md"])
	for (const run of ["pnpm format:check", "pnpm lint:md", "pnpm test:ci"]) {
		const step = ci.jobs.quality.steps.find((step) => step.run === run)
		assert.ok(step, `Missing ${run}`)
		assert.equal(applicable(step.if, changes), true)
	}
	const lint = ci.jobs.quality.steps.find(
		(step) => step.run === "pnpm exec eslint ."
	)
	assert.ok(lint)
	assert.equal(applicable(lint.if, changes), false)
	assert.equal(applicable(lint.if, classify(["eslint.config.mjs"])), true)
})

test("change outputs are connected to the production filter step", () => {
	assert.deepEqual(
		Object.keys(ci.jobs.changes.outputs).sort(),
		Object.keys(filters).sort()
	)
	for (const name of Object.keys(filters)) {
		assert.equal(
			ci.jobs.changes.outputs[name],
			"${{ steps.filter.outputs." + name + " }}"
		)
	}
})

test("headless installation stays aligned with both browser projects", async () => {
	const browser = await import(new URL("playwright.config.ts", root).href)
	const projects = browser.default.projects
	assert.equal(projects.length, 2)
	assert.equal(browser.default.use.channel, undefined)
	assert.notEqual(browser.default.use.headless, false)
	for (const project of projects) {
		assert.notEqual(project.use.headless, false)
		assert.equal(
			project.use.channel,
			undefined,
			`${project.name} needs a full browser`
		)
		assert.ok(
			!project.use.browserName || project.use.browserName === "chromium"
		)
	}
	assert.ok(
		ci.jobs.docs_integration.steps.some(
			(step) =>
				step.run ===
				"pnpm exec playwright install --with-deps --only-shell chromium"
		)
	)
})

test("Scorecard keeps scheduled/security updates without ordinary source pushes", () => {
	const scorecard = readWorkflow("scorecard")
	assert.equal(scorecard.on.schedule.length, 1)
	assert.ok(Object.hasOwn(scorecard.on, "branch_protection_rule"))
	const match = picomatch(scorecard.on.push.paths, { dot: true })
	for (const file of [
		".github/workflows/ci.yml",
		"SECURITY.md",
		"pnpm-lock.yaml",
		"scripts/build-lib.mjs",
	]) {
		assert.equal(match(file), true)
	}
	for (const file of [
		"src/components/button/root.tsx",
		"app/docs/page.tsx",
		"README.md",
	]) {
		assert.equal(match(file), false)
	}
	assert.equal(scorecard.concurrency["cancel-in-progress"], true)
})

test("label token uses only the existing contents and pull-request grants", () => {
	const token = readWorkflow("labeler").jobs.label.steps.find(
		(step) => step.uses === "./.github/actions/setup-bot"
	)
	assert.ok(token)
	// Label create/update/assignment accept pull_requests:write; issues:write is
	// not granted to our app installation and makes token creation fail with 422.
	assert.deepEqual(
		Object.fromEntries(
			Object.entries(token.with).filter(([key]) =>
				key.startsWith("permission-")
			)
		),
		{ "permission-contents": "read", "permission-pull-requests": "write" }
	)
})

test("label definitions are maintained separately from safe PR labeling", () => {
	const labeler = readWorkflow("labeler")
	assert.ok(Object.hasOwn(labeler.on, "workflow_dispatch"))
	assert.deepEqual(labeler.on.push.branches, ["main"])
	assert.deepEqual(labeler.on.push.paths, [
		".github/workflows/labeler.yml",
		".github/labeler.yml",
	])
	assert.ok(labeler.on.pull_request_target.types.includes("synchronize"))
	const job = labeler.jobs.label
	assert.equal(
		job.if,
		"github.event_name == 'pull_request_target' || github.ref == 'refs/heads/main'"
	)
	const sync = job.steps.find(
		(step) => step.name === "Sync Label Colors and Descriptions 🎨"
	)
	assert.equal(sync.if, "github.event_name != 'pull_request_target'")
	const assign = job.steps.find((step) =>
		step.uses?.startsWith("actions/labeler@")
	)
	assert.equal(assign.if, "github.event_name == 'pull_request_target'")
	const checkout = job.steps.find((step) =>
		step.uses?.startsWith("actions/checkout@")
	)
	assert.equal(
		checkout.with.ref,
		undefined,
		"Do not execute untrusted PR head content"
	)
	assert.equal(checkout.with["persist-credentials"], false)
	assert.ok(labeler.concurrency)
})

for (const [results, expected] of [
	["success success", 0],
	["success skipped", 0],
	["success failure skipped", 1],
	["success cancelled", 1],
]) {
	test(`CI gate handles ${results}`, () => {
		const run = ci.jobs.ci_gate.steps.find((step) => step.run).run
		const result = spawnSync("bash", ["-e", "-c", run], {
			env: { ...process.env, RESULTS: results },
			encoding: "utf8",
		})
		assert.equal(result.status, expected, result.stderr)
	})
}
