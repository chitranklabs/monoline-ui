import { render, screen } from "@testing-library/react"

import { BentoGrid, BentoPanel } from "./bento-panel"

describe("BentoPanel", () => {
	it("renders title and description", () => {
		render(<BentoPanel title="Feature" description="Description text" />)
		expect(screen.getByText("Feature")).toBeInTheDocument()
		expect(screen.getByText("Description text")).toBeInTheDocument()
	})

	it("renders eyebrow when provided", () => {
		render(<BentoPanel eyebrow="System" title="Title" description="Desc" />)
		expect(screen.getByText("System")).toBeInTheDocument()
	})

	it("renders icon when provided", () => {
		render(
			<BentoPanel
				title="Title"
				description="Desc"
				icon={<span data-testid="icon">Icon</span>}
			/>
		)
		expect(screen.getByTestId("icon")).toBeInTheDocument()
	})

	it("renders CTA button when ctaLabel provided", () => {
		render(
			<BentoPanel title="Title" description="Desc" ctaLabel="Learn more" />
		)
		expect(screen.getByText("Learn more")).toBeInTheDocument()
	})

	it("forwards className", () => {
		render(
			<BentoPanel
				title="T"
				description="D"
				data-testid="panel"
				className="custom"
			/>
		)
		expect(screen.getByTestId("panel")).toHaveClass("custom")
	})
})

describe("BentoGrid", () => {
	it("renders with data-slot", () => {
		render(<BentoGrid data-testid="grid">Children</BentoGrid>)
		expect(screen.getByTestId("grid")).toHaveAttribute(
			"data-slot",
			"bento-grid"
		)
	})

	it("applies column variants", () => {
		const { rerender } = render(
			<BentoGrid data-testid="grid" columns={2}>
				Items
			</BentoGrid>
		)
		expect(screen.getByTestId("grid")).toHaveClass("md:grid-cols-2")

		rerender(
			<BentoGrid data-testid="grid" columns={4}>
				Items
			</BentoGrid>
		)
		expect(screen.getByTestId("grid")).toHaveClass("lg:grid-cols-4")
	})

	it("forwards className", () => {
		render(
			<BentoGrid data-testid="grid" className="custom">
				Items
			</BentoGrid>
		)
		expect(screen.getByTestId("grid")).toHaveClass("custom")
	})
})
