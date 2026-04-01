import { render, screen } from "@testing-library/react"

import { Container } from "../../src/components/container"

describe("Container", () => {
	it("renders with data-slot", () => {
		render(<Container data-testid="container">Content</Container>)
		expect(screen.getByTestId("container")).toHaveAttribute(
			"data-slot",
			"container"
		)
	})

	it("applies size variants", () => {
		const { rerender } = render(
			<Container data-testid="c" size="sm">
				Content
			</Container>
		)
		expect(screen.getByTestId("c")).toHaveClass("max-w-3xl")

		rerender(
			<Container data-testid="c" size="md">
				Content
			</Container>
		)
		expect(screen.getByTestId("c")).toHaveClass("max-w-5xl")

		rerender(
			<Container data-testid="c" size="full">
				Content
			</Container>
		)
		expect(screen.getByTestId("c")).toHaveClass("max-w-full")
	})

	it("defaults to lg size", () => {
		render(<Container data-testid="c">Content</Container>)
		expect(screen.getByTestId("c")).toHaveClass("max-w-7xl")
	})

	it("forwards className", () => {
		render(
			<Container data-testid="c" className="custom">
				Content
			</Container>
		)
		expect(screen.getByTestId("c")).toHaveClass("custom")
	})

	it("renders children", () => {
		render(<Container>Hello World</Container>)
		expect(screen.getByText("Hello World")).toBeInTheDocument()
	})
})
