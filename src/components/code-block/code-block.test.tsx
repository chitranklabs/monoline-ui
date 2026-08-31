import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { CodeBlock } from "./index"

describe("CodeBlock component", () => {
	it("renders code content and language attribute", () => {
		render(<CodeBlock code="const x = 1;" language="javascript" />)

		expect(screen.getByText("const x = 1;")).toBeInTheDocument()
		const pre = screen.getByRole("figure").querySelector("pre")
		expect(pre).toHaveAttribute("data-language", "javascript")
	})

	it("renders filename header when provided", () => {
		render(
			<CodeBlock filename="utils.ts" code="export const noop = () => {}" />
		)

		expect(screen.getByText("utils.ts")).toBeInTheDocument()
		expect(screen.getByText("Copy")).toBeInTheDocument()
	})

	it("renders description banner when provided", () => {
		render(
			<CodeBlock
				description="Setup instructions for Next.js"
				filename="globals.css"
				code="@import 'theme.css';"
			/>
		)

		expect(
			screen.getByText("Setup instructions for Next.js")
		).toBeInTheDocument()
		expect(screen.getByText("globals.css")).toBeInTheDocument()
		expect(screen.getByText("@import 'theme.css';")).toBeInTheDocument()
	})

	it("handles copy button click", async () => {
		const user = userEvent.setup()
		const writeTextMock = vi.fn().mockResolvedValue(undefined)
		Object.defineProperty(navigator, "clipboard", {
			value: {
				writeText: writeTextMock,
			},
			configurable: true,
		})

		render(<CodeBlock filename="test.js" code="console.log('test')" />)

		const copyBtn = screen.getByRole("button", { name: /copy/i })
		await user.click(copyBtn)

		expect(writeTextMock).toHaveBeenCalledWith("console.log('test')")
		expect(await screen.findByText("✓ Copied")).toBeInTheDocument()
	})
})
