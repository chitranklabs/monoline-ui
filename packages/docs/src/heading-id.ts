/** Allocate stable document anchors, including the shell's reserved content ID. */
export function createHeadingId() {
	const ids = new Set(["content"])
	return (text: string): string => {
		const base =
			text
				.toLowerCase()
				.normalize("NFC")
				.replace(/[^\p{L}\p{N}\s-]/gu, "")
				.trim()
				.replace(/\s+/g, "-") || "section"
		let id = base
		let suffix = 1
		while (ids.has(id)) id = `${base}-${suffix++}`
		ids.add(id)
		return id
	}
}
