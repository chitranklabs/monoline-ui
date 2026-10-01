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

const navToggle = document.querySelector(".nav-toggle")
const navClose = document.querySelector(".nav-close")
const navDialog = document.querySelector(".nav-dialog")
const sidebar = document.querySelector(".sidebar")
if (
	navToggle &&
	navClose &&
	sidebar &&
	typeof navDialog?.showModal === "function"
) {
	const mobile = matchMedia("(max-width: 48rem)")
	const layout = sidebar.parentElement
	const closeNavigation = () => navDialog.close()
	navDialog.addEventListener("close", () => {
		delete document.body.dataset.navOpen
		navToggle.ariaExpanded = "false"
		if (mobile.matches) navToggle.focus()
	})
	const openNavigation = () => {
		if (!mobile.matches || navDialog.open) return
		navDialog.showModal()
		document.body.dataset.navOpen = "true"
		navToggle.ariaExpanded = "true"
		navClose.focus()
	}
	const synchronize = () => {
		const wasOpen = navDialog.open
		if (wasOpen) closeNavigation()
		navToggle.hidden = !mobile.matches
		navClose.hidden = !mobile.matches
		if (mobile.matches) navDialog.append(sidebar)
		else layout.prepend(sidebar)
		if (wasOpen && !mobile.matches)
			sidebar.querySelector('[aria-current="page"]')?.focus()
	}
	navToggle.addEventListener("click", openNavigation)
	navClose.addEventListener("click", closeNavigation)
	navDialog.addEventListener("click", (event) => {
		if (event.target === navDialog) closeNavigation()
	})
	sidebar.addEventListener("click", (event) => {
		if (mobile.matches && event.target.closest("a")) closeNavigation()
	})
	mobile.addEventListener("change", synchronize)
	synchronize()
}

const header = document.querySelector(".site-header")
if (header && "ResizeObserver" in globalThis) {
	new ResizeObserver((entries) => {
		const height = entries[0].borderBoxSize[0].blockSize
		document.documentElement.style.setProperty("--header-offset", `${height}px`)
	}).observe(header)
}

const copyPageLink = document.querySelector(".copy-page-link")
if (copyPageLink && navigator.clipboard?.writeText) {
	const status = document.querySelector(".copy-page-status")
	copyPageLink.hidden = false
	copyPageLink.addEventListener("click", async () => {
		try {
			await navigator.clipboard.writeText(location.href)
			status.textContent = "Copied"
		} catch {
			status.textContent = "Copy failed"
		}
	})
}

const tocLinks = [...document.querySelectorAll('.toc a[href^="#"]')]
if (tocLinks.length && "IntersectionObserver" in globalThis) {
	const links = new Map(
		tocLinks.map((link) => [decodeURIComponent(link.hash.slice(1)), link])
	)
	const visible = new Set()
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) visible.add(entry.target.id)
				else visible.delete(entry.target.id)
			}
			const active = [...links.keys()].find((id) => visible.has(id))
			for (const [id, link] of links) {
				if (id === active) link.setAttribute("aria-current", "location")
				else link.removeAttribute("aria-current")
			}
		},
		{ rootMargin: "-15% 0px -70%" }
	)
	for (const id of links.keys()) {
		const heading = document.getElementById(id)
		if (heading) observer.observe(heading)
	}
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
