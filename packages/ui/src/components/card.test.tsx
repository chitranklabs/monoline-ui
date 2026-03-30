import { render, screen } from "@testing-library/react"

import { Card } from "./card"

describe("Card", () => {
	it("renders with data-slot", () => {
		render(<Card data-testid="card">Content</Card>)
		expect(screen.getByTestId("card")).toHaveAttribute("data-slot", "card")
	})

	it("applies variant classes", () => {
		render(
			<Card data-testid="card" variant="ghost">
				Ghost
			</Card>
		)
		expect(screen.getByTestId("card")).toHaveClass("bg-transparent")
	})

	it("renders compound sub-components", () => {
		render(
			<Card>
				<Card.Header data-testid="header">
					<Card.Eyebrow data-testid="eyebrow">Eyebrow</Card.Eyebrow>
					<Card.Title data-testid="title">Title</Card.Title>
					<Card.Description data-testid="desc">Desc</Card.Description>
				</Card.Header>
				<Card.Content data-testid="content">Body</Card.Content>
				<Card.Footer data-testid="footer">Footer</Card.Footer>
			</Card>
		)

		expect(screen.getByTestId("header")).toHaveAttribute(
			"data-slot",
			"card-header"
		)
		expect(screen.getByTestId("eyebrow")).toHaveAttribute(
			"data-slot",
			"card-eyebrow"
		)
		expect(screen.getByTestId("title")).toHaveAttribute(
			"data-slot",
			"card-title"
		)
		expect(screen.getByTestId("desc")).toHaveAttribute(
			"data-slot",
			"card-description"
		)
		expect(screen.getByTestId("content")).toHaveAttribute(
			"data-slot",
			"card-content"
		)
		expect(screen.getByTestId("footer")).toHaveAttribute(
			"data-slot",
			"card-footer"
		)
	})

	it("forwards className", () => {
		render(
			<Card data-testid="card" className="custom">
				Content
			</Card>
		)
		expect(screen.getByTestId("card")).toHaveClass("custom")
	})
})
