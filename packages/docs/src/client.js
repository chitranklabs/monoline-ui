const themeControl = document.querySelector(".theme-control")
if (themeControl) {
	themeControl.hidden = false
	const systemTheme = matchMedia("(prefers-color-scheme: dark)")
	const isDark = () =>
		document.documentElement.dataset.theme === "dark" ||
		(document.documentElement.dataset.theme === "system" && systemTheme.matches)
	const synchronizeTheme = () => {
		themeControl.setAttribute(
			"aria-label",
			`Switch to ${isDark() ? "light" : "dark"} theme`
		)
	}
	synchronizeTheme()
	addEventListener("pageshow", synchronizeTheme)
	systemTheme.addEventListener("change", synchronizeTheme)
	themeControl.addEventListener("click", () => {
		const theme = isDark() ? "light" : "dark"
		document.documentElement.dataset.theme = theme
		synchronizeTheme()
		try {
			localStorage.setItem("monoline-docs-theme", theme)
		} catch {
			/* Storage is optional. */
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
		/* Storage is optional. */
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
			/* Storage is optional. */
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
				/* Invalid URI. */
			}
		}
	}).observe(header)
}

const copyPageLink = document.querySelector(".copy-page-link")

document.querySelector(".mobile-toc")?.addEventListener("click", (event) => {
	if (event.target.closest("a")) event.currentTarget.open = false
})
const copyMarkdown = document.querySelector(".copy-markdown")
if (copyMarkdown && navigator.clipboard?.writeText) {
	copyMarkdown.hidden = false
	let timer
	copyMarkdown.addEventListener("click", async () => {
		if (copyMarkdown.getAttribute("aria-busy") === "true") return
		const status = document.querySelector(".copy-markdown-status")
		clearTimeout(timer)
		delete copyMarkdown.dataset.copied
		copyMarkdown.setAttribute("aria-busy", "true")
		status.textContent = "Copying…"
		try {
			const response = await fetch(copyMarkdown.dataset.markdownUrl)
			if (!response.ok) throw response
			await navigator.clipboard.writeText(await response.text())
			status.textContent = "Markdown copied"
			copyMarkdown.dataset.copied = ""
			timer = setTimeout(() => delete copyMarkdown.dataset.copied, 2500)
		} catch {
			status.textContent = "Copy failed. Try again."
		} finally {
			copyMarkdown.removeAttribute("aria-busy")
		}
	})
}
if (copyPageLink && navigator.clipboard?.writeText) {
	const status = document.querySelector(".copy-page-status")
	copyPageLink.hidden = false
	copyPageLink.addEventListener("click", async () => {
		if (copyPageLink.getAttribute("aria-busy") === "true") return
		copyPageLink.setAttribute("aria-busy", "true")
		status.textContent = "Copying…"
		try {
			await navigator.clipboard.writeText(location.href)
			status.textContent = "Copied"
		} catch {
			status.textContent = "Copy failed. Try again."
		} finally {
			copyPageLink.removeAttribute("aria-busy")
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
	let selectedByClick = -1
	const update = () => {
		frame = 0
		if (needsMeasure) {
			positions = headings.map((heading) =>
				heading ? heading.getBoundingClientRect().top + scrollY : Infinity
			)
			needsMeasure = false
		}
		const atEnd =
			scrollY > 0 &&
			scrollY + innerHeight >= document.documentElement.scrollHeight - 2
		const threshold = scrollY + headerHeight + 20
		let low = 0
		let high = positions.length
		while (low < high) {
			const middle = (low + high) >>> 1
			if (positions[middle] <= threshold) low = middle + 1
			else high = middle
		}
		const next =
			selectedByClick >= 0
				? selectedByClick
				: atEnd
					? positions.length - 1
					: low - 1
		if (next !== active) {
			tocLinks[active]?.removeAttribute("aria-current")
			tocLinks[next]?.setAttribute("aria-current", "location")
			active = next
		}
	}
	const schedule = () => {
		if (!frame) frame = requestAnimationFrame(update)
	}
	// Anchor scrolling may be clamped near the end of short pages. Preserve the
	// reader's explicit selection until they resume scrolling themselves.
	tocLinks.forEach((link, index) =>
		link.addEventListener("click", (event) => {
			if (
				event.button !== 0 ||
				event.ctrlKey ||
				event.metaKey ||
				event.shiftKey ||
				event.altKey
			)
				return
			selectedByClick = index
			schedule()
		})
	)
	const resumeTracking = () => {
		selectedByClick = -1
		schedule()
	}
	addEventListener("wheel", resumeTracking, { passive: true })
	addEventListener("touchmove", resumeTracking, { passive: true })
	addEventListener("keydown", (event) => {
		if (
			[
				"ArrowUp",
				"ArrowDown",
				"PageUp",
				"PageDown",
				"Home",
				"End",
				" ",
			].includes(event.key) &&
			!event.target?.closest?.("input, textarea, select, [contenteditable]")
		)
			resumeTracking()
	})
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
			delete button.dataset.copied
			status.textContent = "Copying…"
			button.disabled = true
			try {
				await navigator.clipboard.writeText(
					button.parentElement.querySelector("code").textContent
				)
				status.textContent = "Copied"
				button.dataset.copied = ""
				timer = setTimeout(() => {
					status.textContent = ""
					delete button.dataset.copied
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
		/* Storage is optional. */
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
			/* Storage is optional. */
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
document.querySelectorAll(".docs-preview-content").forEach((preview) => {
	const preventNavigation = (event) => {
		if (
			event.target instanceof Element &&
			event.target.closest("a[href], area[href]")
		)
			event.preventDefault()
	}
	preview.addEventListener("click", preventNavigation)
	preview.addEventListener("auxclick", preventNavigation)
	preview.addEventListener("submit", (event) => event.preventDefault())
})
