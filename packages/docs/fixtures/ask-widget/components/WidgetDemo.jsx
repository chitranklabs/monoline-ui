import { useEffect, useState } from "react"

import { ChatWidget } from "@chitrank2050/ask-widget"
import "@chitrank2050/ask-widget/style.css"

async function* streamResponse(message) {
	for (const part of ["Local example: ", message, ". No request was sent."]) {
		await new Promise((resolve) => setTimeout(resolve, 20))
		yield part
	}
}

export default function WidgetDemo() {
	const [theme, setTheme] = useState("dark")
	useEffect(() => {
		const media = matchMedia("(prefers-color-scheme: dark)")
		const update = () => {
			const selected = document.documentElement.dataset.theme
			setTheme(
				selected === "light" || selected === "dark"
					? selected
					: media.matches
						? "dark"
						: "light"
			)
		}
		const observer = new MutationObserver(update)
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-theme"],
		})
		media.addEventListener("change", update)
		update()
		return () => {
			observer.disconnect()
			media.removeEventListener("change", update)
		}
	}, [])
	return (
		<ChatWidget
			theme={theme}
			title="Ask Widget example"
			initialMessage="Send a message to try local streaming."
			streamResponse={streamResponse}
			persistenceKey="monoline-ask-widget-example"
		/>
	)
}
