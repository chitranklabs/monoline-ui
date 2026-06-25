import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Card } from "./index"

describe("Card", () => {
	it("renders as a div by default", () => {
		const ref = { current: null } as React.RefObject<HTMLDivElement | null>
		render(
			<Card ref={ref}>
				<Card.Body>Content</Card.Body>
			</Card>
		)
		expect(ref.current?.tagName).toBe("DIV")
		expect(screen.getByText("Content")).toBeInTheDocument()
	})

	it("renders as a link when href is provided", () => {
		render(
			<Card href="/test">
				<Card.Body>Link card</Card.Body>
			</Card>
		)
		const link = screen.getByRole("link")
		expect(link).toHaveAttribute("href", "/test")
	})

	it("adds noopener noreferrer for blank target links", () => {
		render(
			<Card href="https://example.com" target="_blank">
				<Card.Body>External</Card.Body>
			</Card>
		)
		const link = screen.getByRole("link")
		expect(link).toHaveAttribute("rel", "noopener noreferrer")
	})

	it("applies size data attribute", () => {
		const ref = { current: null } as React.RefObject<HTMLDivElement | null>
		render(
			<Card ref={ref} size="lg">
				<Card.Body>Large</Card.Body>
			</Card>
		)
		expect(ref.current).toHaveAttribute("data-card-size", "lg")
	})

	it("renders clickable cards as native buttons", async () => {
		const user = userEvent.setup()
		const onClick = vi.fn()
		render(
			<Card onClick={onClick}>
				<Card.Body>Clickable card</Card.Body>
			</Card>
		)

		const button = screen.getByRole("button", { name: "Clickable card" })
		expect(button.tagName).toBe("BUTTON")
		expect(button).toHaveAttribute("type", "button")

		await user.click(button)
		expect(onClick).toHaveBeenCalledTimes(1)
	})
})
