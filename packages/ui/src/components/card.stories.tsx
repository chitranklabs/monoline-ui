import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Badge } from "./badge"
import { Button } from "./button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./card"

const meta = {
	title: "Components/Card",
	component: Card,
	tags: ["autodocs"],
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: () => (
		<Card className="w-[360px]">
			<CardHeader>
				<Badge>Featured</Badge>
				<CardTitle>Surface system</CardTitle>
				<CardDescription>
					A flexible card shell for marketing, dashboard, and portfolio layouts.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Button>Inspect component</Button>
			</CardContent>
		</Card>
	),
}
