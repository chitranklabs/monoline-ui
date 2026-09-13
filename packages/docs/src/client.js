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
