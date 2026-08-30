import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

const clientDirectivePattern = /^(?:"use client"|'use client');?/

export function hasUseClientDirective(source) {
	return clientDirectivePattern.test(source.trimStart())
}

export async function findClientComponentEntries(projectRoot) {
	const componentSourceDir = path.join(projectRoot, "src", "components")
	const componentSourceEntries = await readdir(componentSourceDir, {
		withFileTypes: true,
	})
	const clientEntries = []

	for (const entry of componentSourceEntries) {
		if (!entry.isDirectory()) continue

		const componentFiles = await readdir(
			path.join(componentSourceDir, entry.name),
			{ withFileTypes: true }
		)

		for (const componentFile of componentFiles) {
			if (
				!componentFile.isFile() ||
				!componentFile.name.match(/\.[cm]?[jt]sx?$/)
			) {
				continue
			}

			const source = await readFile(
				path.join(componentSourceDir, entry.name, componentFile.name),
				"utf8"
			)
			if (hasUseClientDirective(source)) {
				clientEntries.push(entry.name)
				break
			}
		}
	}

	return clientEntries.sort()
}
