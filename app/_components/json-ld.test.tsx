import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import JsonLd, { getSoftwareSourceCodeJsonLd } from "./json-ld"

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

	it("describes the package as source code with verifiable links", () => {
		const jsonLd = getSoftwareSourceCodeJsonLd(
			null,
			"https://monolineui.chitrankagnihotri.com",
			"0.2.3"
		)

		expect(jsonLd).toMatchObject({
			"@type": "SoftwareSourceCode",
			"@id": "https://monolineui.chitrankagnihotri.com/#software-source-code",
			name: "Monoline UI",
			codeRepository: "https://github.com/chitranklabs/monoline-ui",
			programmingLanguage: ["TypeScript", "CSS"],
			runtimePlatform: "React 19",
			license: "https://github.com/chitranklabs/monoline-ui/blob/main/LICENSE",
			version: "0.2.3",
			isAccessibleForFree: true,
		})
	})
})
