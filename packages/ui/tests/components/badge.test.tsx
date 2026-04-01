import { render, screen } from "@testing-library/react"

import { Badge } from "../../src/components/badge"

describe("Badge", () => {
	it("renders its content", () => {
		render(<Badge>Label</Badge>)
		expect(screen.getByText("Label")).toBeInTheDocument()
	})

	it("applies variant classes", () => {
		const { rerender } = render(<Badge variant="outline">Outline</Badge>)
		expect(screen.getByText("Outline")).toHaveClass("bg-transparent")

		rerender(<Badge variant="destructive">Error</Badge>)
		expect(screen.getByText("Error")).toHaveClass("text-destructive")

		rerender(<Badge variant="ghost">Ghost</Badge>)
		expect(screen.getByText("Ghost")).toHaveClass("border-transparent")
	})

	it("forwards className", () => {
		render(<Badge className="custom">Tag</Badge>)
		expect(screen.getByText("Tag")).toHaveClass("custom")
	})
})
