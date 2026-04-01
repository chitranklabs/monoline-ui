import { render, screen } from "@testing-library/react"

import { Button } from "../../src/components/button"

describe("Button", () => {
	it("renders its label", () => {
		render(<Button>Launch</Button>)
		expect(screen.getByRole("button", { name: "Launch" })).toBeInTheDocument()
	})

	it("has data-slot attribute", () => {
		render(<Button>Click</Button>)
		expect(screen.getByRole("button")).toHaveAttribute("data-slot", "button")
	})

	it("applies variant classes", () => {
		const { rerender } = render(<Button variant="ghost">Ghost</Button>)
		expect(screen.getByRole("button")).toHaveClass("hover:bg-accent")

		rerender(<Button variant="destructive">Delete</Button>)
		expect(screen.getByRole("button")).toHaveClass("bg-destructive")

		rerender(<Button variant="link">Link</Button>)
		expect(screen.getByRole("button")).toHaveClass("underline-offset-4")
	})

	it("applies size classes", () => {
		const { rerender } = render(<Button size="xs">Small</Button>)
		expect(screen.getByRole("button")).toHaveClass("h-8")

		rerender(<Button size="lg">Large</Button>)
		expect(screen.getByRole("button")).toHaveClass("h-12")
	})

	it("forwards className", () => {
		render(<Button className="custom-class">Btn</Button>)
		expect(screen.getByRole("button")).toHaveClass("custom-class")
	})

	it("forwards HTML attributes", () => {
		render(<Button data-testid="my-btn">Btn</Button>)
		expect(screen.getByTestId("my-btn")).toBeInTheDocument()
	})
})
