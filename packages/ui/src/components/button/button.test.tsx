import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Button } from "./index"

describe("Button", () => {
	it("renders with default props", () => {
		render(<Button>Click me</Button>)
		const button = screen.getByRole("button", { name: "Click me" })
		expect(button).toBeInTheDocument()
		expect(button).toHaveAttribute("type", "button")
	})

	it("forwards ref", () => {
		const ref = { current: null } as React.RefObject<HTMLButtonElement | null>
		render(<Button ref={ref}>Ref test</Button>)
		expect(ref.current).toBeInstanceOf(HTMLButtonElement)
	})

	it("applies primary variant class", () => {
		render(<Button variant="primary">Primary</Button>)
		expect(screen.getByRole("button", { name: "Primary" })).toHaveClass(
			"ml-btn--primary"
		)
	})

	it("applies ghost variant class", () => {
		render(<Button variant="ghost">Ghost</Button>)
		expect(screen.getByRole("button", { name: "Ghost" })).toHaveClass(
			"ml-btn--ghost"
		)
	})

	it("renders as disabled", () => {
		render(<Button disabled>Disabled</Button>)
		expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled()
	})

	it("shows loading state", () => {
		render(<Button loading>Loading</Button>)
		const button = screen.getByRole("button", { name: "Loading" })
		expect(button).toHaveAttribute("aria-busy", "true")
		expect(button).toHaveAttribute("data-loading", "true")
	})

	it("handles click events", async () => {
		const user = userEvent.setup()
		const onClick = vi.fn()
		render(<Button onClick={onClick}>Click</Button>)
		await user.click(screen.getByRole("button", { name: "Click" }))
		expect(onClick).toHaveBeenCalledTimes(1)
	})

	it("renders pill variant", () => {
		render(<Button pill>Pill</Button>)
		expect(screen.getByRole("button", { name: "Pill" })).toHaveClass(
			"rounded-pill"
		)
	})
})
