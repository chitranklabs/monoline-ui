import { render, screen } from "@testing-library/react"

import { StatusBadge } from "../../src/components/status-badge"

describe("StatusBadge", () => {
	it("renders label text", () => {
		render(<StatusBadge label="Online" />)
		expect(screen.getByText("Online")).toBeInTheDocument()
	})

	it("defaults to success status", () => {
		const { container } = render(<StatusBadge label="Active" />)
		const dot = container.querySelector(".bg-emerald-500")
		expect(dot).toBeInTheDocument()
	})

	it("renders warning status", () => {
		const { container } = render(
			<StatusBadge label="Pending" status="warning" />
		)
		const dot = container.querySelector(".bg-amber-500")
		expect(dot).toBeInTheDocument()
	})

	it("renders neutral status", () => {
		const { container } = render(<StatusBadge label="Idle" status="neutral" />)
		const dot = container.querySelector(".bg-muted-foreground")
		expect(dot).toBeInTheDocument()
	})

	it("forwards className", () => {
		render(<StatusBadge label="Test" data-testid="badge" className="custom" />)
		expect(screen.getByTestId("badge")).toHaveClass("custom")
	})
})
