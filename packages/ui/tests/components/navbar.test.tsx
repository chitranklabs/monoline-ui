import { render, screen } from "@testing-library/react"

import { Navbar } from "../../src/components/navbar"

describe("Navbar", () => {
	it("renders brand text", () => {
		render(<Navbar brand="My App" />)
		expect(screen.getByText("My App")).toBeInTheDocument()
	})

	it("renders link items", () => {
		render(
			<Navbar
				links={[
					{ href: "/docs", label: "Docs" },
					{ href: "/api", label: "API" },
				]}
			/>
		)
		expect(screen.getByText("Docs")).toBeInTheDocument()
		expect(screen.getByText("API")).toBeInTheDocument()
	})

	it("renders actions slot", () => {
		render(<Navbar actions={<button type="button">Install</button>} />)
		expect(screen.getByRole("button", { name: "Install" })).toBeInTheDocument()
	})

	it("forwards className", () => {
		render(<Navbar data-testid="nav" className="custom" />)
		expect(screen.getByTestId("nav")).toHaveClass("custom")
	})
})
