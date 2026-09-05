import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { RadioGroup } from "./index"

describe("RadioGroup", () => {
	it("associates item copy and changes the selected value", async () => {
		const user = userEvent.setup()
		const onValueChange = vi.fn()
		render(
			<RadioGroup
				defaultValue="weekly"
				onValueChange={onValueChange}
				aria-label="Digest cadence"
			>
				<RadioGroup.Item
					value="daily"
					label="Daily"
					description="Every morning"
				/>
				<RadioGroup.Item value="weekly" label="Weekly" />
			</RadioGroup>
		)

		await user.click(screen.getByText("Daily"))

		expect(screen.getByRole("radio", { name: /daily/i })).toBeChecked()
		expect(onValueChange).toHaveBeenCalledWith("daily")
	})

	it("skips disabled options during keyboard navigation", async () => {
		const user = userEvent.setup()
		render(
			<RadioGroup defaultValue="a" aria-label="Choice">
				<RadioGroup.Item value="a" aria-label="A" />
				<RadioGroup.Item value="b" aria-label="B" disabled />
				<RadioGroup.Item value="c" aria-label="C" />
			</RadioGroup>
		)

		screen.getByRole("radio", { name: "A" }).focus()
		await user.keyboard("{ArrowDown}")
		expect(screen.getByRole("radio", { name: "C" })).toHaveFocus()
		expect(screen.getByRole("radio", { name: "B" })).not.toHaveFocus()
	})
})
