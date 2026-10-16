import { act, render, screen } from "@testing-library/react"
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
	it("waits for clipboard confirmation before reporting success", async () => {
		const user = userEvent.setup()
		let resolveCopy!: () => void
		Object.defineProperty(navigator, "clipboard", {
			value: {
				writeText: vi.fn(
					() =>
						new Promise<void>((resolve) => {
							resolveCopy = resolve
						})
				),
			},
			configurable: true,
		})
		render(<CodeBlock filename="pending.ts" code="const ready = true" />)
		await user.click(screen.getByRole("button", { name: "Copy" }))
		expect(screen.queryByText("✓ Copied")).not.toBeInTheDocument()
		await act(async () => resolveCopy())
		expect(await screen.findByText("✓ Copied")).toBeInTheDocument()
	})

	it("reports rejected clipboard access and permits retry", async () => {
		const user = userEvent.setup()
		const writeText = vi
			.fn()
			.mockRejectedValueOnce(new Error("Clipboard denied"))
			.mockResolvedValueOnce(undefined)
		Object.defineProperty(navigator, "clipboard", {
			value: { writeText },
			configurable: true,
		})
		render(<CodeBlock filename="retry.ts" code="const ready = true" />)
		await user.click(screen.getByRole("button", { name: "Copy" }))
		expect(await screen.findByRole("status")).toHaveTextContent(
			"Copy unavailable"
		)
		expect(screen.queryByText("✓ Copied")).not.toBeInTheDocument()
		await user.click(screen.getByRole("button", { name: "Copy" }))
		expect(await screen.findByText("✓ Copied")).toBeInTheDocument()
	})

	it("offers manual copying when the clipboard API is unavailable", async () => {
		const user = userEvent.setup()
		Object.defineProperty(navigator, "clipboard", {
			value: undefined,
			configurable: true,
		})
		render(<CodeBlock code="const ready = true" />)
		await user.click(screen.getByRole("button", { name: "Copy" }))
		expect(await screen.findByRole("status")).toHaveTextContent(
			"Select the code"
		)
		expect(screen.queryByText("✓ Copied")).not.toBeInTheDocument()
	})
	it("keeps feedback attached to the latest code when clipboard requests finish out of order", async () => {
		const user = userEvent.setup()
		const completions = new Map<string, () => void>()
		Object.defineProperty(navigator, "clipboard", {
			value: {
				writeText: vi.fn(
					(text: string) =>
						new Promise<void>((resolve) => completions.set(text, resolve))
				),
			},
			configurable: true,
		})
		const { rerender } = render(
			<CodeBlock filename="example.ts" code="first" />
		)
		await user.click(screen.getByRole("button", { name: "Copy" }))
		rerender(<CodeBlock filename="example.ts" code="second" />)
		await user.click(screen.getByRole("button", { name: "Copy" }))
		await act(async () => completions.get("second")?.())
		expect(screen.getByText("✓ Copied")).toBeInTheDocument()
		await act(async () => completions.get("first")?.())
		expect(screen.getByText("✓ Copied")).toBeInTheDocument()
		expect(screen.getByRole("status")).toHaveTextContent("Code copied")
	})
})
