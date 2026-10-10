// Generated from ChatWidgetProps by Ask Widget's build-time docgen step.
export const apiRows = [
	["apiUrl", "string", "—", "Base URL of the chat API."],
	["apiToken", "string", "—", "Bearer token used for API authentication."],
	[
		"position",
		"ChatPosition",
		"bottom-right",
		"Floating button and panel position.",
	],
	["theme", "ChatTheme", "dark", "Color theme preset."],
	[
		"colors",
		"ChatColors",
		"—",
		"Color overrides merged with the selected theme.",
	],
	["title", "string", "Ask AI", "Chat panel heading."],
	["placeholder", "string", "Ask me anything...", "Message input placeholder."],
	[
		"initialMessage",
		"string",
		"Hello! How can I help you today?",
		"First assistant message.",
	],
	["defaultOpen", "boolean", "false", "Whether the panel starts open."],
	["labels", "ChatLabels", "—", "Custom labels for technical indicators."],
	[
		"persistenceKey",
		"string",
		"ask_widget_session",
		"localStorage key for chat history.",
	],
	[
		"streamResponse",
		"ChatStreamHandler",
		"—",
		"Custom response and streaming handler.",
	],
].map(([name, type, defaultValue, description]) => ({
	name,
	type,
	default: defaultValue,
	description,
}))
