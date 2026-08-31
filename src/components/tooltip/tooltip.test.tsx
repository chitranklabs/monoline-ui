import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Tooltip } from "./index"

class ResizeObserverMock implements ResizeObserver {
	disconnect() {}
	observe() {}
	unobserve() {}
}

describe("Tooltip", () => {
	it("reveals supporting content when the trigger receives focus", async () => {
		globalThis.ResizeObserver = ResizeObserverMock
		const user = userEvent.setup()
		render(
			<Tooltip.Provider>
				<Tooltip>
					<Tooltip.Trigger>
						<button type="button">Copy</button>
					</Tooltip.Trigger>
					<Tooltip.Content>Copy install command</Tooltip.Content>
				</Tooltip>
			</Tooltip.Provider>
		)

		await user.tab()
		expect(
			await screen.findByRole("tooltip", { hidden: true })
		).toHaveTextContent("Copy install command")
	})
})
