import assert from "node:assert/strict"
import { execFile } from "node:child_process"
import { readFileSync } from "node:fs"
import {
	cp,
	mkdir,
	mkdtemp,
	readFile,
	readdir,
	realpath,
	rm,
	writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { promisify } from "node:util"

import { projectPaths } from "./project-paths.mjs"

const execute = promisify(execFile)
const version = (name, root = projectPaths.repositoryRoot) =>
	JSON.parse(
		readFileSync(path.join(root, "node_modules", name, "package.json"), "utf8")
	).version
const json = (value) => JSON.stringify(value, null, "\t") + "\n"

// Do not inherit Node loaders or workspace resolution from the calling shell.
const consumerEnv = { ...process.env, NEXT_TELEMETRY_DISABLED: "1" }
delete consumerEnv.NODE_PATH
delete consumerEnv.NODE_OPTIONS

async function run(command, args, cwd, timeout = 120_000) {
	try {
		return await execute(command, args, {
			cwd,
			env: consumerEnv,
			timeout,
			maxBuffer: 8 * 1024 * 1024,
		})
	} catch (error) {
		throw new Error(
			`${command} ${args.join(" ")} failed in ${cwd}\n${error.stdout ?? ""}\n${error.stderr ?? ""}`,
			{ cause: error }
		)
	}
}

async function verifyConsumer(parent, tarball, major) {
	const started = performance.now()
	const cwd = path.join(parent, `react-${major}`)
	await mkdir(cwd)
	await cp(tarball, path.join(cwd, "monoline.tgz"))
	const dependencies = {
		"@chitrank2050/monoline-ui": "file:./monoline.tgz",
		react: major === 18 ? "18.2.0" : version("react"),
		"react-dom": major === 18 ? "18.2.0" : version("react-dom"),
	}
	const devDependencies = {
		typescript: version("typescript"),
		"@types/react": major === 18 ? "18.3.28" : version("@types/react"),
		"@types/react-dom": major === 18 ? "18.3.7" : version("@types/react-dom"),
		"@types/node": version("@types/node"),
	}
	if (major === 19) {
		dependencies.next = version("next", projectPaths.websiteRoot)
		devDependencies.tailwindcss = version(
			"tailwindcss",
			projectPaths.websiteRoot
		)
		devDependencies["@tailwindcss/postcss"] = version(
			"@tailwindcss/postcss",
			projectPaths.websiteRoot
		)
	}
	await writeFile(
		path.join(cwd, "package.json"),
		json({
			name: `monoline-consumer-react-${major}`,
			private: true,
			type: "module",
			dependencies,
			devDependencies,
		})
	)
	console.log(`Installing React ${major} tarball consumer…`)
	// Independent install: no workspace overrides, aliases, hoisted dependencies,
	// or lifecycle scripts. Reuse pnpm's download cache, not the repo's modules.
	await run(
		"pnpm",
		[
			"install",
			"--ignore-scripts",
			"--prefer-offline",
			"--config.auto-install-peers=false",
			"--config.node-linker=isolated",
		],
		cwd,
		240_000
	)
	const installed = await realpath(
		path.join(cwd, "node_modules/@chitrank2050/monoline-ui")
	)
	assert.ok(
		installed.startsWith(cwd + path.sep),
		"Package must resolve inside its consumer, never into the repository"
	)
	const manifest = JSON.parse(
		await readFile(path.join(installed, "package.json"), "utf8")
	)
	assert.equal(manifest.name, "@chitrank2050/monoline-ui")
	assert.equal(manifest.devDependencies, undefined)
	for (const file of [
		"README.md",
		"LICENSE",
		"index.js",
		"index.d.ts",
		"styles/theme.css",
	]) {
		await readFile(path.join(installed, file))
	}
	const packageFiles = await readdir(installed, { recursive: true })
	assert.ok(
		!packageFiles.some(
			(file) => file.startsWith("src/") || /\.test\.[cm]?[jt]sx?$/.test(file)
		),
		"Source and tests must not leak into the npm artifact"
	)
	const targets = []
	for (const [name, target] of Object.entries(manifest.exports)) {
		if (name.includes("*")) continue
		for (const file of typeof target === "string"
			? [target]
			: Object.values(target)) {
			await readFile(path.join(installed, file))
		}
		if (target.import)
			targets.push(name === "." ? manifest.name : manifest.name + name.slice(1))
	}
	// Wildcard paths are a public contract too, beyond the short component names.
	for (const directory of ["foundations", "lib"]) {
		for (const file of await readdir(path.join(installed, directory))) {
			if (file.endsWith(".js"))
				targets.push(`${manifest.name}/${directory}/${file.slice(0, -3)}`)
		}
	}
	for (const name of Object.keys(manifest.exports).filter(
		(name) =>
			manifest.exports[name]?.import?.startsWith("./components/") &&
			!name.includes("*")
	)) {
		targets.push(`${manifest.name}/components/${name.slice(2)}`)
	}
	await writeFile(
		path.join(cwd, "smoke.mjs"),
		`
import assert from "node:assert/strict"
import React from "react"
import { renderToString } from "react-dom/server"
import { Button } from "@chitrank2050/monoline-ui/button"
import { Card } from "@chitrank2050/monoline-ui/card"
import { Toggle } from "@chitrank2050/monoline-ui/toggle"
assert.ok(React.version.startsWith("${major}."))
${targets.map((target) => `await import(${JSON.stringify(target)})`).join("\n")}
for (const specifier of ["@chitrank2050/monoline-ui/not-a-component", "@chitrank2050/monoline-ui/src/index.ts"]) {
  await assert.rejects(import(specifier), { code: "ERR_PACKAGE_PATH_NOT_EXPORTED" })
}
const html = renderToString(React.createElement(Card, null,
  React.createElement(Button, null, "View work"),
  React.createElement(Toggle, { "aria-label": "Pin project" }, "Pin project")))
assert.ok(html.includes("View work") && html.includes("Pin project"))
`
	)
	await run(process.execPath, ["smoke.mjs"], cwd)
	await writeFile(
		path.join(cwd, "types.tsx"),
		`
import { createRef } from "react"
import { Button } from "@chitrank2050/monoline-ui/button"
import { Card } from "@chitrank2050/monoline-ui/card"
import { Toggle } from "@chitrank2050/monoline-ui/toggle"
${targets.map((target, index) => `import * as Entry${index} from ${JSON.stringify(target)}\nvoid Entry${index}`).join("\n")}
const ref = createRef<HTMLButtonElement>()
export const example = <Card><Button ref={ref}>View work</Button><Toggle aria-label="Pin project" /></Card>
// @ts-expect-error Invalid variants must be rejected, not silently become any.
export const invalid = <Button variant="not-a-variant" />
`
	)
	await writeFile(
		path.join(cwd, "tsconfig.json"),
		json({
			compilerOptions: {
				strict: true,
				noEmit: true,
				skipLibCheck: false,
				jsx: "react-jsx",
				target: "ES2022",
				module: "ESNext",
				moduleResolution: "Bundler",
				esModuleInterop: true,
			},
			include: ["types.tsx"],
		})
	)
	await run(
		process.execPath,
		[path.join(cwd, "node_modules/typescript/bin/tsc"), "--noEmit"],
		cwd
	)
	if (major === 19) {
		await mkdir(path.join(cwd, "app"))
		await writeFile(
			path.join(cwd, "app/layout.jsx"),
			`import "./globals.css"\nexport default function Layout({children}) { return <html lang="en"><body>{children}</body></html> }\n`
		)
		await writeFile(
			path.join(cwd, "app/page.jsx"),
			`import {Card} from "@chitrank2050/monoline-ui/card"\nimport {Button} from "@chitrank2050/monoline-ui/button"\nimport {Toggle} from "@chitrank2050/monoline-ui/toggle"\nexport default function Page() { return <main><Card>Server-safe card</Card><Button>View work</Button><Toggle aria-label="Theme" /></main> }\n`
		)
		await writeFile(
			path.join(cwd, "app/globals.css"),
			'@import "tailwindcss";\n@import "@chitrank2050/monoline-ui/theme.css";\n'
		)
		await writeFile(
			path.join(cwd, "postcss.config.mjs"),
			'export default { plugins: { "@tailwindcss/postcss": {} } }\n'
		)
		await run(
			process.execPath,
			[path.join(cwd, "node_modules/next/dist/bin/next"), "build"],
			cwd
		)
		const staticRoot = path.join(cwd, ".next/static")
		const cssFiles = (await readdir(staticRoot, { recursive: true })).filter(
			(file) => file.endsWith(".css")
		)
		assert.ok(cssFiles.length > 0, "Next must emit packaged CSS")
		const css = (
			await Promise.all(
				cssFiles.map((file) => readFile(path.join(staticRoot, file), "utf8"))
			)
		).join("\n")
		for (const marker of [".ml-btn--primary", ".h-ml-9", "--accent"]) {
			assert.ok(css.includes(marker), `Compiled CSS missing ${marker}`)
		}
		assert.match(
			css,
			/\[data-theme=["']?light["']?\]/,
			"Compiled CSS must retain the light theme"
		)
		assert.match(
			css,
			/\[data-theme=["']?dark["']?\]/,
			"Compiled CSS must retain the dark theme"
		)
	}
	console.log(
		`✓ React ${major}: installed exports, types and rendering${major === 19 ? ", Next.js RSC and Tailwind CSS" : ""} (${Math.round(performance.now() - started)}ms)`
	)
}

export async function runTarballConsumers(majors = [18, 19]) {
	const directory = await realpath(
		await mkdtemp(path.join(tmpdir(), "monoline-tarball-"))
	)
	try {
		assert.ok(!directory.startsWith(projectPaths.repositoryRoot + path.sep))
		const tarball = path.join(directory, "monoline.tgz")
		await run("pnpm", ["pack", "--out", tarball], projectPaths.distDir)
		// Sequential installs avoid lock contention in the shared pnpm store.
		for (const major of majors) await verifyConsumer(directory, tarball, major)
	} finally {
		await rm(directory, { recursive: true, force: true })
	}
}
