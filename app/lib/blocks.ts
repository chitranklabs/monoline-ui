import registry from "../../registry.json"

export interface BlockDefinition {
	name: string
	title: string
	description: string
	seoDescription: string
	categories: string[]
}

export const blocks: BlockDefinition[] = registry.items.map((item) => ({
	name: item.name,
	title: item.title,
	description: item.description,
	seoDescription: item.meta.seoDescription,
	categories: item.categories,
}))

export const blockSlugs = blocks.map((block) => block.name)

export function blockPath(slug: string): `/${string}` {
	return `/docs/blocks/${slug}`
}

export function getBlock(slug: string): BlockDefinition | undefined {
	return blocks.find((block) => block.name === slug)
}
