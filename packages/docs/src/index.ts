import type { NavigationItem } from "./navigation"

export {
	discoverPages,
	findPage,
	type DiscoverPagesOptions,
	type DocumentationMetadata,
	type DocumentationPage,
} from "./content"

export {
	buildNavigation,
	type NavigationItem,
	type ResolvedNavigation,
} from "./navigation"

export interface MonolineDocsConfig {
	title: string
	description?: string
	navigation?: NavigationItem[]
}

export function defineConfig(config: MonolineDocsConfig): MonolineDocsConfig {
	return config
}
