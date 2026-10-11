import assert from "node:assert/strict"
import { existsSync, statSync } from "node:fs"
import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import picomatch from "picomatch"
import ts from "typescript"

// Deno 2.9.6 publishes rewritten module specifiers and JSX/type pragmas.
// Keep every other byte intact so registry verification still detects changes.
export function jsrSource(source, file, dependencies, typeDependencies) {
	if (!/\.[cm]?[jt]sx?$/.test(file)) return source
	const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true)
	assert.equal(parsed.parseDiagnostics.length, 0, `Invalid module: ${file}`)
	const edits = []
	const resolve = (specifier) => {
		if (specifier.startsWith(".")) {
			const target = path.resolve(path.dirname(file), specifier)
			const suffix = [
				"",
				".ts",
				".tsx",
				".js",
				".jsx",
				"/index.ts",
				"/index.tsx",
				"/index.js",
			].find(
				(suffix) =>
					existsSync(`${target}${suffix}`) &&
					statSync(`${target}${suffix}`).isFile()
			)
			assert.notEqual(
				suffix,
				undefined,
				`Unresolved publication import: ${specifier}`
			)
			return `${specifier}${suffix}`
		}
		const name = specifier.startsWith("@")
			? specifier.split("/").slice(0, 2).join("/")
			: specifier.split("/")[0]
		if (!dependencies[name]) return specifier
		return `npm:${name}@${dependencies[name]}${specifier.slice(name.length)}`
	}
	const visit = (node) => {
		let literal
		if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
			literal = node.moduleSpecifier
		} else if (
			ts.isImportTypeNode(node) &&
			ts.isLiteralTypeNode(node.argument)
		) {
			literal = node.argument.literal
		} else if (
			ts.isCallExpression(node) &&
			node.expression.kind === ts.SyntaxKind.ImportKeyword
		) {
			literal = node.arguments[0]
		}
		if (literal && ts.isStringLiteralLike(literal)) {
			const resolved = resolve(literal.text)
			if (resolved !== literal.text) {
				edits.push({
					start: literal.getStart(parsed) + 1,
					end: literal.end - 1,
					text: resolved,
				})
			}
			if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
				const name = literal.text.split("/")[0]
				const types = typeDependencies[`@types/${name}`]
				if (dependencies[name] && types) {
					edits.push({
						start: node.getStart(parsed),
						end: node.getStart(parsed),
						text: `/* @ts-types="npm:@types/${name}@${types}" */ `,
					})
				}
			}
		}
		ts.forEachChild(node, visit)
	}
	visit(parsed)
	for (const edit of edits.sort((a, b) => b.start - a.start)) {
		source = source.slice(0, edit.start) + edit.text + source.slice(edit.end)
	}
	if (/\.[jt]sx$/.test(file)) {
		assert(
			dependencies.react,
			"JSX publishing requires a declared React version"
		)
		assert(
			!/@jsx(?:Runtime|ImportSource|Factory|FragmentFactory)/.test(source),
			"Custom JSX pragmas require explicit publication verification support"
		)
		const react = `npm:react@${dependencies.react}`
		source = `/** @jsxRuntime automatic *//** @jsxImportSource ${react} *//** @jsxImportSourceTypes ${react} */${source}`
	}
	return source
}

export async function jsrPublicationContext(directory) {
	const manifest = JSON.parse(
		await readFile(path.join(directory, "package.json"), "utf8")
	)
	const root = JSON.parse(await readFile("package.json", "utf8"))
	const config = JSON.parse(
		await readFile(path.join(directory, "jsr.json"), "utf8")
	)
	const excluded = picomatch(config.publish.exclude)
	const files = []
	for (const included of config.publish.include) {
		assert(
			!/[*?{}]/.test(included),
			"Publication verification requires explicit include paths"
		)
		const target = path.join(directory, included)
		const paths = statSync(target).isDirectory()
			? (await readdir(target, { recursive: true, withFileTypes: true }))
					.filter((entry) => entry.isFile())
					.map((entry) => path.join(entry.parentPath, entry.name))
			: [target]
		for (const file of paths) {
			const relative = path.relative(directory, file).split(path.sep).join("/")
			if (!excluded(relative)) files.push(`/${relative}`)
		}
	}
	return {
		files: files.sort(),
		exports: config.exports,
		dependencies: { ...manifest.dependencies, ...manifest.devDependencies },
		typeDependencies: {
			...root.dependencies,
			...root.devDependencies,
			...manifest.dependencies,
			...manifest.devDependencies,
		},
	}
}
