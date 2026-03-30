import { render, screen } from "@testing-library/react"

import { StatCard } from "./stat-card"

describe("StatCard", () => {
	it("renders label and value", () => {
		render(<StatCard label="Coverage" value="84%" />)
		expect(screen.getByText("Coverage")).toBeInTheDocument()
		expect(screen.getByText("84%")).toBeInTheDocument()
	})

	it("renders helper text when provided", () => {
		render(<StatCard label="Score" value="10" helper="Out of 10" />)
		expect(screen.getByText("Out of 10")).toBeInTheDocument()
	})

	it("forwards className", () => {
		render(
			<StatCard label="Test" value="1" data-testid="stat" className="custom" />
		)
		expect(screen.getByTestId("stat")).toHaveClass("custom")
	})
})
