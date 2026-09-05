import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Avatar } from "./index"

describe("Avatar", () => {
	it("renders initials when no src", () => {
		render(<Avatar>CA</Avatar>)
		expect(screen.getByText("CA")).toBeInTheDocument()
	})

	it("forwards ref", () => {
		const ref = { current: null } as React.RefObject<HTMLSpanElement | null>
		render(<Avatar ref={ref}>CA</Avatar>)
		expect(ref.current).toBeInstanceOf(HTMLSpanElement)
	})

	it("renders image when src is provided", () => {
		render(<Avatar src="/avatar.jpg" alt="User avatar" />)
		expect(screen.getByRole("img")).toHaveAttribute("src", "/avatar.jpg")
	})

	it("applies size data attribute", () => {
		const ref = { current: null } as React.RefObject<HTMLSpanElement | null>
		render(
			<Avatar ref={ref} size="lg">
				CA
			</Avatar>
		)
		expect(ref.current).toHaveAttribute("data-size", "lg")
	})
})
