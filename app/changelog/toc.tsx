"use client"

import type { GitCliffRelease } from "@chitrank2050/monoline-ui/changelog"
import { Toc } from "@chitrank2050/monoline-ui/toc"

interface ChangelogTocProps {
	releases: GitCliffRelease[]
}

export function ChangelogToc({ releases }: ChangelogTocProps) {
	const items = releases.map((r) => {
		const version = r.version ?? "Unreleased"
		return {
			id: `release-${version.replace(/\./g, "-")}`,
			label: version,
		}
	})

	return <Toc items={items} heading="Releases" scrollOffset={88} />
}
