"use client"

import { ToggleButton } from "@chitrank2050/monoline-ui"
import { useState } from "react"

export function ToggleButtonDemo() {
	const [view, setView] = useState<"preview" | "code">("preview")
	const [billing, setBilling] = useState<"monthly" | "annual">("annual")

	return (
		<div className="flex flex-col items-center gap-8">
			<ToggleButton
				options={[
					{ value: "preview", label: "Preview" },
					{ value: "code", label: "Code" },
				]}
				activeValue={view}
				onChange={setView}
			/>
			<ToggleButton
				options={[
					{ value: "monthly", label: "Monthly" },
					{ value: "annual", label: "Annual" },
				]}
				activeValue={billing}
				onChange={setBilling}
			/>
		</div>
	)
}
