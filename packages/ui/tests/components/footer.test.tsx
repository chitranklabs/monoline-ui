import { render, screen } from "@testing-library/react"

import { Footer } from "../../src/components/footer"

describe("Footer", () => {
	it("renders credit text", () => {
		render(<Footer credit="Made with love" />)
		expect(screen.getByText("Made with love")).toBeInTheDocument()
	})

	it("renders link items", () => {
		render(
			<Footer
				links={[
					{ href: "/github", label: "GitHub" },
					{ href: "/license", label: "License" },
				]}
			/>
		)
		expect(screen.getByText("GitHub")).toBeInTheDocument()
		expect(screen.getByText("License")).toBeInTheDocument()
	})

	it("forwards className", () => {
		render(<Footer data-testid="footer" className="custom" />)
		expect(screen.getByTestId("footer")).toHaveClass("custom")
	})
})
