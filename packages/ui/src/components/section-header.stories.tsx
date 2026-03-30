import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Button } from "./button"
import { SectionHeader } from "./section-header"

const meta = {
	title: "Components/SectionHeader",
	component: SectionHeader,
	args: {
		eyebrow: "Patterns",
		title: "Reusable composition for content sections",
		description:
			"Use this to keep documentation and marketing sections visually consistent.",
		actions: <Button size="sm">Inspect</Button>,
	},
	tags: ["autodocs"],
} satisfies Meta<typeof SectionHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Centered: Story = {
	args: {
		align: "center",
	},
}
