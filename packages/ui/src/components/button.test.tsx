import { render, screen } from "@testing-library/react"

import { Button } from "./button"

describe("Button", () => {
	it("renders its label", () => {
		render(<Button>Launch</Button>)

		expect(screen.getByRole("button", { name: "Launch" })).toBeInTheDocument()
	})
})
