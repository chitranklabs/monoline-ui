const script = document.currentScript
const revision = Number(script.dataset.revision)
const events = new EventSource(new URL("events", script.src))
const banner = document.createElement("div")
banner.className = "dev-error"
banner.setAttribute("role", "alert")
banner.hidden = true
document.body.prepend(banner)
events.onmessage = (event) => {
	const update = JSON.parse(event.data)
	banner.textContent = update.error ? `Build failed: ${update.error}` : ""
	banner.hidden = !update.error
	if (!update.error && update.revision !== revision) location.reload()
}
window.addEventListener("pagehide", () => events.close(), { once: true })
window.addEventListener("pageshow", (event) => {
	if (event.persisted) location.reload()
})
