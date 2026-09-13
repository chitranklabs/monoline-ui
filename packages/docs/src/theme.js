// Run before styles load so a saved preference applies on the first paint.
try {
	const theme = localStorage.getItem("monoline-docs-theme")
	if (theme === "light" || theme === "dark" || theme === "system")
		document.documentElement.dataset.theme = theme
} catch {
	// Storage may be disabled; the CSS system preference still works.
}
