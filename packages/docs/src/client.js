const themeControl = document.querySelector(".theme-control")
const themeSelect = themeControl?.querySelector("select")
if (themeSelect) {
	themeControl.hidden = false
	themeSelect.value = document.documentElement.dataset.theme ?? "system"
	themeSelect.addEventListener("change", () => {
		document.documentElement.dataset.theme = themeSelect.value
		try {
			localStorage.setItem("monoline-docs-theme", themeSelect.value)
		} catch {
			/* The preference still applies for this page. */
		}
	})
}

if (navigator.clipboard?.writeText) {
	for (const button of document.querySelectorAll(".copy-code")) {
		button.hidden = false
		let timer
		button.addEventListener("click", async () => {
			const status = button.parentElement.querySelector(".copy-status")
			clearTimeout(timer)
			status.textContent = ""
			button.disabled = true
			try {
				await navigator.clipboard.writeText(
					button.parentElement.querySelector("code").textContent
				)
				status.textContent = "Copied"
				timer = setTimeout(() => {
					status.textContent = ""
				}, 2500)
			} catch {
				status.textContent = "Copy failed. Select the code to copy it manually."
			} finally {
				button.disabled = false
			}
		})
	}
}

for (const tabs of document.querySelectorAll("[data-docs-tabs]")) {
	const list = tabs.querySelector("[data-tab-list]")
	const buttons = [...list.querySelectorAll("button")]
	const panels = [...tabs.querySelectorAll("section[data-tab-panel]")]
	list.hidden = false
	list.role = "tablist"
	list.ariaLabel = "Options"
	buttons.forEach((button) => {
		button.role = "tab"
		button.id = button.dataset.tabId
		button.setAttribute("aria-controls", button.dataset.tabPanel)
	})
	panels.forEach((panel, index) => {
		panel.role = "tabpanel"
		panel.setAttribute("aria-labelledby", buttons[index].id)
		panel.querySelector(".docs-tab-label").hidden = true
	})
	const select = (index, focus = false) => {
		buttons.forEach((button, item) => {
			button.ariaSelected = String(item === index)
			button.tabIndex = item === index ? 0 : -1
		})
		panels.forEach((panel, item) => (panel.hidden = item !== index))
		if (focus) buttons[index]?.focus()
	}
	buttons.forEach((button, index) => {
		button.addEventListener("click", () => select(index))
		button.addEventListener("keydown", (event) => {
			if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
				return
			event.preventDefault()
			const next =
				event.key === "Home"
					? 0
					: event.key === "End"
						? buttons.length - 1
						: (index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) %
							buttons.length
			select(next, true)
		})
	})
	tabs.dataset.ready = "true"
	select(0)
}
