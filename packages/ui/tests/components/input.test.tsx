import { render, screen } from "@testing-library/react"

import { Input } from "../../src/components/input"

describe("Input", () => {
	it("renders an input element", () => {
		render(<Input placeholder="Email" />)
		expect(screen.getByPlaceholderText("Email")).toBeInTheDocument()
	})

	it("has data-slot attribute", () => {
		render(<Input data-testid="input" />)
		expect(screen.getByTestId("input")).toHaveAttribute("data-slot", "input")
	})

	it("forwards type prop", () => {
		render(<Input type="password" data-testid="input" />)
		expect(screen.getByTestId("input")).toHaveAttribute("type", "password")
	})

	it("forwards className", () => {
		render(<Input data-testid="input" className="custom" />)
		expect(screen.getByTestId("input")).toHaveClass("custom")
	})
})
