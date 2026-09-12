export interface MonolineDocsConfig {
	title: string
	description?: string
	navigation?: NavigationItem[]
}

export type NavigationItem =
	| { label: string; href: `/${string}` }
	| { label: string; items: NavigationItem[] }

export function defineConfig(config: MonolineDocsConfig): MonolineDocsConfig {
	return config
}
