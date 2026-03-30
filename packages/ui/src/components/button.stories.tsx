import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Button } from "./button"

const meta = {
	title: "Components/Button",
	component: Button,
	args: {
		children: "Primary action",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Outline: Story = {
	args: {
		variant: "outline",
		children: "Secondary action",
	},
}

export const Ghost: Story = {
	args: {
		variant: "ghost",
		children: "Quiet action",
	},
}
