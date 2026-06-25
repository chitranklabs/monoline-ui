import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import JsonLd from "./json-ld"

describe("JsonLd", () => {
	it("escapes script-breaking characters in structured data", () => {
		const { container } = render(
			<JsonLd data={{ name: "</script><script>alert(1)</script>" }} />
		)

		const script = container.querySelector('script[type="application/ld+json"]')

		expect(script).not.toBeNull()
		expect(script?.innerHTML).toContain("\\u003c/script>")
		expect(script?.innerHTML).not.toContain("</script>")
	})
})
