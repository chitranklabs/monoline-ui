import { readFile, readdir } from "node:fs/promises"
import { join } from "node:path"

export const assetTypes: Record<string, string> = {
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".gif": "image/gif",
	".webp": "image/webp",
	".avif": "image/avif",
	".ico": "image/x-icon",
	".woff": "font/woff",
	".woff2": "font/woff2",
	".ttf": "font/ttf",
	".otf": "font/otf",
	".css": "text/css; charset=utf-8",
	".pdf": "application/pdf",
	".txt": "text/plain; charset=utf-8",
	".json": "application/json",
}

export function isAssetName(name: string): boolean {
	return /^assets\/(?:[\p{L}\p{N}_-]+(?:\.[\p{L}\p{N}_-]+)*\/)*[\p{L}\p{N}_-]+(?:\.[\p{L}\p{N}_-]+)*\.(svg|png|jpe?g|gif|webp|avif|ico|woff2?|ttf|otf|css|pdf|txt|json)$/u.test(
		name
	)
}

export async function collectAssets(
	directory?: string
): Promise<Map<string, Uint8Array>> {
	const files = new Map<string, Uint8Array>()
	if (!directory) return files
	async function visit(path: string, prefix: string) {
		for (const entry of await readdir(path, { withFileTypes: true })) {
			if (entry.name.startsWith(".")) continue
			const name = `${prefix}/${entry.name}`
			const source = join(path, entry.name)
			if (entry.isSymbolicLink())
				throw new Error(`Asset symlinks are not supported: ${source}`)
			if (entry.isDirectory()) await visit(source, name)
			else {
				if (!entry.isFile() || !isAssetName(name))
					throw new Error(`Unsupported asset path: ${source}`)
				files.set(name, await readFile(source))
			}
		}
	}
	await visit(directory, "assets")
	return files
}
