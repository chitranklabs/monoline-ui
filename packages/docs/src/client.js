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
let restoreSidebarScroll = () => {}
let saveSidebarScroll = () => {}
if (sidebar) {
	const storageKey = `monoline-docs-sidebar:${document.documentElement.dataset.base}:${sidebar.dataset.section}`
	let saved = 0
	try {
		const value = Number(sessionStorage.getItem(storageKey))
		if (Number.isFinite(value) && value >= 0) saved = value
	} catch {
		/* Navigation remains usable when storage is unavailable. */
	}
	restoreSidebarScroll = () => {
		;(sidebar.closest(".nav-dialog") ?? sidebar).scrollTop = saved
	}
	restoreSidebarScroll()
	saveSidebarScroll = () => {
		const scroller = sidebar.closest(".nav-dialog") ?? sidebar
		if (!scroller.offsetHeight) return
		saved = scroller.scrollTop
		try {
			sessionStorage.setItem(storageKey, String(saved))
		} catch {
			/* Optional persistence. */
		}
	}
	addEventListener("pagehide", saveSidebarScroll)
	sidebar.addEventListener("click", (event) => {
		if (event.target.closest("a")) saveSidebarScroll()
	})
}

if (
	navToggle &&
	navClose &&
	sidebar &&
	typeof navDialog?.showModal === "function"
) {
	const mobile = matchMedia("(max-width: 48rem)")
	const layout = sidebar.parentElement
	const closeNavigation = () => {
		saveSidebarScroll()
		navDialog.close()
	}
	navDialog.addEventListener("cancel", saveSidebarScroll)
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
		restoreSidebarScroll()
	}
	let synchronized = false
	const synchronize = () => {
		if (synchronized) saveSidebarScroll()
		synchronized = true
		const wasOpen = navDialog.open
		if (wasOpen) closeNavigation()
		navToggle.hidden = !mobile.matches
		navClose.hidden = !mobile.matches
		if (mobile.matches) navDialog.append(sidebar)
		else {
			layout.prepend(sidebar)
			restoreSidebarScroll()
		}
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

let invalidateToc
let headerHeight = 0
let initialAnchorAligned = false
const header = document.querySelector(".site-header")
if (header && "ResizeObserver" in globalThis) {
	new ResizeObserver((entries) => {
		const height = entries[0].borderBoxSize[0].blockSize
		headerHeight = height
		document.documentElement.style.setProperty("--header-offset", `${height}px`)
		invalidateToc?.()
		if (!initialAnchorAligned) {
			initialAnchorAligned = true
			restoreSidebarScroll()
			try {
				document
					.getElementById(decodeURIComponent(location.hash.slice(1)))
					?.scrollIntoView()
			} catch {
				/* Malformed fragments have no target. */
			}
		}
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
if (tocLinks.length) {
	const headings = tocLinks.map((link) =>
		document.getElementById(decodeURIComponent(link.hash.slice(1)))
	)
	let positions = []
	let needsMeasure = true
	let frame = 0
	let active = -1
	const update = () => {
		frame = 0
		if (needsMeasure) {
			positions = headings.map((heading) =>
				heading ? heading.getBoundingClientRect().top + scrollY : Infinity
			)
			needsMeasure = false
		}
		const threshold = scrollY + headerHeight + 20
		let low = 0
		let high = positions.length
		while (low < high) {
			const middle = (low + high) >>> 1
			if (positions[middle] <= threshold) low = middle + 1
			else high = middle
		}
		const next = low - 1
		if (next !== active) {
			tocLinks[active]?.removeAttribute("aria-current")
			tocLinks[next]?.setAttribute("aria-current", "location")
			active = next
		}
	}
	const schedule = () => {
		if (!frame) frame = requestAnimationFrame(update)
	}
	invalidateToc = () => {
		needsMeasure = true
		schedule()
	}
	addEventListener("scroll", schedule, { passive: true })
	addEventListener("resize", invalidateToc, { passive: true })
	const article = document.querySelector("article")
	if (article && "ResizeObserver" in globalThis)
		new ResizeObserver(invalidateToc).observe(article)
	document.fonts?.ready.then(invalidateToc)
	schedule()
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

const packageManagerGroups = []
const managerStorageKey = `monoline-docs-package-manager:${document.documentElement.dataset.base}`
let packageManager
if (document.querySelector('[data-sync="package-manager"]')) {
	try {
		packageManager = localStorage.getItem(managerStorageKey)
	} catch {
		/* Optional preference. */
	}
}
for (const tabs of document.querySelectorAll("[data-docs-tabs]")) {
	const list = tabs.querySelector(":scope > [data-tab-list]")
	const buttons = [...list.querySelectorAll(":scope > button")]
	const panels = [...tabs.querySelectorAll(":scope > section[data-tab-panel]")]
	list.hidden = false
	list.role = "tablist"
	list.ariaLabel = tabs.dataset.label ?? "Options"
	buttons.forEach((button) => {
		button.role = "tab"
		button.id = button.dataset.tabId
		button.setAttribute("aria-controls", button.dataset.tabPanel)
	})
	panels.forEach((panel, index) => {
		panel.role = "tabpanel"
		panel.tabIndex = 0
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
	const synced = tabs.dataset.sync === "package-manager"
	const selectManager = (manager) => {
		const index = buttons.findIndex(
			(button) => button.dataset.tabKey === manager
		)
		if (index >= 0) select(index)
	}
	if (synced) packageManagerGroups.push(selectManager)
	const activate = (index, focus = false) => {
		select(index, focus)
		if (!synced) return
		packageManager = buttons[index].dataset.tabKey
		for (const selectGroup of packageManagerGroups) selectGroup(packageManager)
		try {
			localStorage.setItem(managerStorageKey, packageManager)
		} catch {
			/* In-page synchronization still works. */
		}
	}
	buttons.forEach((button, index) => {
		button.addEventListener("click", () => activate(index))
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
			activate(next, true)
		})
	})
	tabs.dataset.ready = "true"
	select(0)
	if (synced && packageManager) selectManager(packageManager)
}
