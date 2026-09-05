// Workspace targets live under dist; the npm artifact is rooted inside dist.
// Relocate file targets so one authored manifest serves both consumers.
export function createPublishManifest(manifest) {
	const relocate = (target) =>
		typeof target === "string"
			? target.replace(/^\.\/dist\//, "./")
			: Object.fromEntries(
					Object.entries(target).map(([key, value]) => [key, relocate(value)])
				)
	const { scripts, devDependencies, ...published } = manifest
	void scripts
	void devDependencies
	return {
		...published,
		publishConfig: { access: manifest.publishConfig.access },
		files: ["**/*"],
		main: relocate(manifest.main),
		module: relocate(manifest.module),
		types: relocate(manifest.types),
		sideEffects: manifest.sideEffects.map(relocate),
		exports: relocate(manifest.exports),
	}
}
