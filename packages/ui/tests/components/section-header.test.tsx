import { render, screen } from "@testing-library/react"

import { SectionHeader } from "../../src/components/section-header"

describe("SectionHeader", () => {
	it("renders title", () => {
		render(<SectionHeader title="Getting Started" />)
		expect(screen.getByText("Getting Started")).toBeInTheDocument()
	})

	it("renders eyebrow when provided", () => {
		render(<SectionHeader eyebrow="Overview" title="Title" />)
		expect(screen.getByText("Overview")).toBeInTheDocument()
	})

	it("renders description when provided", () => {
		render(<SectionHeader title="Title" description="Some description" />)
		expect(screen.getByText("Some description")).toBeInTheDocument()
	})

	it("renders actions slot", () => {
		render(
			<SectionHeader
				title="Title"
				actions={<button type="button">Action</button>}
			/>
		)
		expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument()
	})

	it("forwards className", () => {
		render(
			<SectionHeader title="Title" data-testid="header" className="custom" />
		)
		expect(screen.getByTestId("header")).toHaveClass("custom")
	})
})
