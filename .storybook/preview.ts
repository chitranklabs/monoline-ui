import { withThemeByClassName } from "@storybook/addon-themes"
import type { Preview } from "@storybook/nextjs-vite"

import "./storybook.css"

const preview: Preview = {
	parameters: {
		layout: "centered",
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
	decorators: [
		withThemeByClassName({
			themes: {
				light: "",
				dark: "dark",
			},
			defaultTheme: "light",
		}),
	],
}

export default preview
