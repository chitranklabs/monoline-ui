import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { StatCard } from "./stat-card"

const meta = {
	title: "Components/StatCard",
	component: StatCard,
	args: {
		label: "Coverage",
		value: "84%",
		helper:
			"A compact metric card for dashboards, landing sections, and benchmarks.",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof StatCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
