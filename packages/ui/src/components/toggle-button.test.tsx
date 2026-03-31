import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ToggleButton } from "./toggle-button"

const options = [
	{ value: "light" as const, label: "Light" },
	{ value: "dark" as const, label: "Dark" },
] as [{ value: "light"; label: string }, { value: "dark"; label: string }]

describe("ToggleButton", () => {
	it("renders both option labels", () => {
		render(
			<ToggleButton options={options} activeValue="light" onChange={() => {}} />
		)
		expect(screen.getByText("Light")).toBeInTheDocument()
		expect(screen.getByText("Dark")).toBeInTheDocument()
	})

	it("calls onChange with correct value when option clicked", async () => {
		const onChange = vi.fn()
		render(
			<ToggleButton options={options} activeValue="light" onChange={onChange} />
		)
		await userEvent.click(screen.getByText("Dark"))
		expect(onChange).toHaveBeenCalledWith("dark")
	})

	it("has data-slot attribute", () => {
		render(
			<ToggleButton
				options={options}
				activeValue="light"
				onChange={() => {}}
				data-testid="toggle"
			/>
		)
		expect(screen.getByTestId("toggle")).toHaveAttribute(
			"data-slot",
			"toggle-button"
		)
	})

	it("forwards className", () => {
		render(
			<ToggleButton
				options={options}
				activeValue="light"
				onChange={() => {}}
				data-testid="toggle"
				className="custom"
			/>
		)
		expect(screen.getByTestId("toggle")).toHaveClass("custom")
	})
})
