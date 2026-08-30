"use client"

import { Toc } from "@chitrank2050/monoline-ui/toc"

interface ChangelogTocProps {
	items: ReadonlyArray<{ id: string; label: string }>
}

export function ChangelogToc({ items }: ChangelogTocProps) {
	return <Toc items={[...items]} heading="Releases" scrollOffset={88} />
}
