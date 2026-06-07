"use client"

import {
	Suspense,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from "react"
import { createPortal } from "react-dom"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import {
	Footer,
	type FooterSize,
} from "@chitrank2050/monoline-ui/components/footer"

type RenderMode = "single" | "all"
type DetailTab = "usage" | "props" | "tokens" | "source"
type ThemeMode = "light" | "dark"
type ViewportKey = "mobile" | "tablet" | "desktop" | "wide"

interface ViewportOption {
	key: ViewportKey
	label: string
	width: number
}

interface ZoomOption {
	label: string
	value: number
}

interface PreviewFrameProps {
	children: ReactNode
	contentKey: string
	theme: ThemeMode
	viewportWidth: number
	zoom: number
}

const footerSizes: FooterSize[] = ["sm", "md", "lg"]

const viewportOptions: ViewportOption[] = [
	{ key: "mobile", label: "Mobile", width: 390 },
	{ key: "tablet", label: "Tablet", width: 834 },
	{ key: "desktop", label: "Desktop", width: 1280 },
	{ key: "wide", label: "Wide", width: 1920 },
]

const zoomOptions: ZoomOption[] = [
	{ label: "50%", value: 0.5 },
	{ label: "75%", value: 0.75 },
	{ label: "100%", value: 1 },
	{ label: "125%", value: 1.25 },
]

const defaultControls = {
	render: "single" as RenderMode,
	size: "md" as FooterSize,
	viewport: "desktop" as ViewportKey,
	theme: "light" as ThemeMode,
	zoom: 0.75,
	tab: "usage" as DetailTab,
}

const footerColumns = [
	{
		title: "Navigate",
		links: [
			{ href: "#", label: "Projects" },
			{ href: "#", label: "Blog" },
			{ href: "#", label: "About" },
			{ href: "#", label: "Now" },
		],
	},
	{
		title: "Elsewhere",
		links: [
			{ href: "https://linkedin.com", label: "LinkedIn", external: true },
			{ href: "https://github.com", label: "GitHub", external: true },
			{ href: "https://x.com", label: "X / Twitter", external: true },
			{ href: "mailto:hello@example.com", label: "Email", external: true },
		],
	},
]

const propsRows = [
	[
		"brand",
		"ReactNode",
		"Brand block - usually a wordmark + tagline + status pill",
	],
	[
		"columns",
		"Column[]",
		"Array of { title, links } - auto-laid into 2/3/4 cols",
	],
	[
		"subscribe",
		"ReactNode?",
		"Optional subscribe form slot - adds a 4th column",
	],
	["meta", "ReactNode?", "Left-aligned text in the bottom bar"],
	["attribution", "ReactNode?", "Right-aligned text in the bottom bar"],
] as const

const tokenRows = [
	["--ml-footer-y-sm/md/lg", "Vertical padding for each component size"],
	["--ml-footer-x-sm/md/lg", "Horizontal container padding by size"],
	["--ml-footer-layout-cols-*-desktop", "Desktop grid tracks"],
	["--ml-footer-subscribe-control-height", "Inline subscribe input height"],
	["--ml-footer-link-hover-x", "External link hover offset"],
] as const

const sourceSnippet = `import { Footer } from "@chitrank2050/monoline-ui/components/footer"

export function SiteFooter() {
  return (
    <Footer
      size="md"
      columns={[
        { title: "Navigate", links: [
          { label: "Projects", href: "/projects" },
          { label: "Blog", href: "/blog" },
        ]},
        { title: "Elsewhere", links: [
          { label: "GitHub", href: "https://github.com", external: true },
        ]},
      ]}
      subscribe={<Footer.Subscribe />}
      meta="© 2026 · v3.2.0"
      attribution="Next 15 · Sanity · Tailwind 4"
    />
  )
}`

const detailTabs: Array<{ key: DetailTab; label: string }> = [
	{ key: "usage", label: "Usage" },
	{ key: "props", label: "Props" },
	{ key: "tokens", label: "Tokens" },
	{ key: "source", label: "Source" },
]

function formatSize(size: FooterSize) {
	return size.toUpperCase()
}

function parseRenderMode(value: string | null): RenderMode {
	return value === "all" ? "all" : defaultControls.render
}

function parseFooterSize(value: string | null): FooterSize {
	return footerSizes.includes(value as FooterSize)
		? (value as FooterSize)
		: defaultControls.size
}

function parseViewport(value: string | null): ViewportKey {
	return viewportOptions.some((option) => option.key === value)
		? (value as ViewportKey)
		: defaultControls.viewport
}

function parseTheme(value: string | null): ThemeMode {
	return value === "dark" ? "dark" : defaultControls.theme
}

function parseZoom(value: string | null) {
	const parsed = Number(value)
	const matchedOption = zoomOptions.find(
		(option) => Math.round(option.value * 100) === parsed
	)

	return matchedOption?.value ?? defaultControls.zoom
}

function parseDetailTab(value: string | null): DetailTab {
	return detailTabs.some((tab) => tab.key === value)
		? (value as DetailTab)
		: defaultControls.tab
}

function FooterPreview({ size }: { size: FooterSize }) {
	return (
		<div className="playground-canvas__preview" data-size={size}>
			<Footer
				size={size}
				columns={[...footerColumns]}
				meta="© 2026 · Built by Chitrank Agnihotri · v3.2.0"
				attribution="Next 15 · Sanity · Tailwind 4"
			/>
		</div>
	)
}

export default function FooterPage() {
	return (
		<Suspense fallback={null}>
			<FooterPageClient />
		</Suspense>
	)
}

function PreviewFrame({
	children,
	contentKey,
	theme,
	viewportWidth,
	zoom,
}: PreviewFrameProps) {
	const iframeRef = useRef<HTMLIFrameElement>(null)
	const [mountNode, setMountNode] = useState<HTMLElement | null>(null)
	const [contentHeight, setContentHeight] = useState(456)

	useEffect(() => {
		const iframe = iframeRef.current

		if (!iframe) {
			return
		}

		const iframeDocument = iframe.contentDocument

		if (!iframeDocument) {
			return
		}

		iframeDocument.open()
		iframeDocument.write(
			'<!doctype html><html><head><base target="_parent" /></head><body><div id="playground-preview-root"></div></body></html>'
		)
		iframeDocument.close()
		iframeDocument.documentElement.dataset.theme = theme
		iframeDocument.body.style.margin = "0"
		iframeDocument.body.style.background = "var(--background)"

		for (const node of document.querySelectorAll(
			'link[rel="stylesheet"], style'
		)) {
			iframeDocument.head.appendChild(node.cloneNode(true))
		}

		setMountNode(
			iframeDocument.getElementById("playground-preview-root") as HTMLElement
		)
	}, [theme])

	useEffect(() => {
		const iframeDocument = iframeRef.current?.contentDocument

		if (iframeDocument) {
			iframeDocument.documentElement.dataset.theme = theme
		}
	}, [theme])

	useEffect(() => {
		if (!mountNode) {
			return
		}

		const iframeDocument = iframeRef.current?.contentDocument

		if (!iframeDocument) {
			return
		}

		const updateHeight = () => {
			const contentRect = mountNode.getBoundingClientRect()
			const nextHeight = Math.max(
				456,
				Math.ceil(contentRect.height),
				mountNode.scrollHeight
			)
			setContentHeight(nextHeight)
		}
		const observer = new ResizeObserver(updateHeight)
		const frame = requestAnimationFrame(updateHeight)

		observer.observe(mountNode)
		updateHeight()

		return () => {
			cancelAnimationFrame(frame)
			observer.disconnect()
		}
	}, [contentKey, mountNode, viewportWidth])

	return (
		<div
			className="playground-canvas__stage"
			style={{
				width: viewportWidth * zoom,
				height: contentHeight * zoom,
			}}
		>
			<iframe
				ref={iframeRef}
				title="Footer preview"
				className="playground-canvas__frame"
				style={{
					width: viewportWidth,
					height: contentHeight,
					transform: `scale(${zoom})`,
				}}
			/>
			{mountNode ? createPortal(children, mountNode) : null}
		</div>
	)
}

function FooterPageClient() {
	const pathname = usePathname()
	const router = useRouter()
	const searchParams = useSearchParams()
	const renderMode = parseRenderMode(searchParams.get("render"))
	const size = parseFooterSize(searchParams.get("size"))
	const viewport = parseViewport(searchParams.get("viewport"))
	const theme = parseTheme(searchParams.get("theme"))
	const zoom = parseZoom(searchParams.get("zoom"))
	const detailTab = parseDetailTab(searchParams.get("tab"))

	const viewportOption = useMemo(
		() =>
			viewportOptions.find((option) => option.key === viewport) ??
			viewportOptions[2],
		[viewport]
	)
	const zoomOption = useMemo(
		() => zoomOptions.find((option) => option.value === zoom) ?? zoomOptions[1],
		[zoom]
	)
	const renderedSizes = renderMode === "all" ? footerSizes : [size]
	const previewKey = `${renderMode}:${renderedSizes.join(",")}:${viewport}:${theme}`

	const setControl = (
		updates: Partial<{
			render: RenderMode
			size: FooterSize
			viewport: ViewportKey
			theme: ThemeMode
			zoom: number
			tab: DetailTab
		}>
	) => {
		const nextState = {
			render: renderMode,
			size,
			viewport,
			theme,
			zoom,
			tab: detailTab,
			...updates,
		}
		const nextParams = new URLSearchParams(searchParams.toString())
		const writeParam = <T extends string | number>(
			key: string,
			value: T,
			defaultValue: T
		) => {
			if (value === defaultValue) {
				nextParams.delete(key)
				return
			}

			nextParams.set(key, String(value))
		}

		writeParam("render", nextState.render, defaultControls.render)
		writeParam("size", nextState.size, defaultControls.size)
		writeParam("viewport", nextState.viewport, defaultControls.viewport)
		writeParam("theme", nextState.theme, defaultControls.theme)
		writeParam(
			"zoom",
			Math.round(nextState.zoom * 100),
			Math.round(defaultControls.zoom * 100)
		)
		writeParam("tab", nextState.tab, defaultControls.tab)

		for (const [key, value] of searchParams.entries()) {
			if (
				!["render", "size", "viewport", "theme", "zoom", "tab"].includes(key)
			) {
				nextParams.set(key, value)
			}
		}

		const queryString = nextParams.toString()
		router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
			scroll: false,
		})
	}

	return (
		<main className="docs-page">
			<header className="docs-page__head docs-page__head--component">
				<p className="ml-eyebrow">Component</p>
				<div className="component-headline">
					<h1>Footer</h1>
					<span>stable · v0.2.0</span>
					<span>2.1 kb gzipped</span>
				</div>
				<p>
					Inspect the footer at real viewport widths, switch component size,
					render all sizes together, and zoom the canvas without losing the
					package&apos;s actual Tailwind/theme styling.
				</p>
			</header>

			<section className="playground-controls">
				<div className="playground-controls__group">
					<label>Render</label>
					<div className="playground-segmented">
						<button
							type="button"
							aria-pressed={renderMode === "single"}
							className="ml-interaction-surface"
							onClick={() => setControl({ render: "single" })}
						>
							Single
						</button>
						<button
							type="button"
							aria-pressed={renderMode === "all"}
							className="ml-interaction-surface"
							onClick={() => setControl({ render: "all" })}
						>
							All sizes
						</button>
					</div>
				</div>
				<div className="playground-controls__group">
					<label>Size</label>
					<div className="playground-segmented">
						{footerSizes.map((footerSize) => (
							<button
								key={footerSize}
								type="button"
								aria-pressed={size === footerSize}
								className="ml-interaction-surface"
								onClick={() => {
									setControl({ render: "single", size: footerSize })
								}}
							>
								{formatSize(footerSize)}
							</button>
						))}
					</div>
				</div>
				<div className="playground-controls__group">
					<label>Viewport</label>
					<div className="playground-segmented">
						{viewportOptions.map((option) => (
							<button
								key={option.key}
								type="button"
								aria-pressed={viewport === option.key}
								className="ml-interaction-surface"
								onClick={() => setControl({ viewport: option.key })}
							>
								{option.label}
							</button>
						))}
					</div>
				</div>
				<div className="playground-controls__group">
					<label>Theme</label>
					<div className="playground-segmented">
						<button
							type="button"
							aria-pressed={theme === "light"}
							className="ml-interaction-surface"
							onClick={() => setControl({ theme: "light" })}
						>
							Light
						</button>
						<button
							type="button"
							aria-pressed={theme === "dark"}
							className="ml-interaction-surface"
							onClick={() => setControl({ theme: "dark" })}
						>
							Dark
						</button>
					</div>
				</div>
				<div className="playground-controls__group">
					<label>Zoom</label>
					<div className="playground-segmented">
						{zoomOptions.map((option) => (
							<button
								key={option.label}
								type="button"
								aria-pressed={zoom === option.value}
								className="ml-interaction-surface"
								onClick={() => setControl({ zoom: option.value })}
							>
								{option.label}
							</button>
						))}
					</div>
				</div>
			</section>

			<section className="playground-canvas">
				<div className="playground-canvas__meta">
					<span>
						{renderMode === "all" ? "All sizes" : formatSize(size)} ·{" "}
						{zoomOption.label}
					</span>
					<span>
						{viewportOption.label} · {viewportOption.width}px · {theme}
					</span>
				</div>
				<div className="playground-canvas__viewport">
					<PreviewFrame
						contentKey={previewKey}
						theme={theme}
						viewportWidth={viewportOption.width}
						zoom={zoom}
					>
						{renderedSizes.map((footerSize) => (
							<FooterPreview key={footerSize} size={footerSize} />
						))}
					</PreviewFrame>
				</div>
			</section>

			<section className="playground-detail">
				<div className="playground-detail__tabs" role="tablist">
					{detailTabs.map((tab) => (
						<button
							key={tab.key}
							type="button"
							role="tab"
							aria-selected={detailTab === tab.key}
							aria-pressed={detailTab === tab.key}
							className="ml-interaction-tab-underline"
							onClick={() => setControl({ tab: tab.key })}
						>
							{tab.label}
						</button>
					))}
				</div>
				<div className="playground-detail__body">
					{detailTab === "usage" ? (
						<>
							<h3>Import</h3>
							<pre>{`import { Footer } from "@chitrank2050/monoline-ui/components/footer"`}</pre>

							<h3>Basic usage</h3>
							<pre>{`<Footer
  brand={<Brand />}
  status={<Footer.Status>Open to work</Footer.Status>}
  columns={[
    { title: "Navigate", links: [
      { label: "Projects", href: "/projects" },
      { label: "Blog", href: "/blog" },
    ]},
    { title: "Elsewhere", links: [
      { label: "LinkedIn", href: "...", external: true },
    ]},
  ]}
  subscribe={<Footer.Subscribe />}
  meta="© 2026 · v3.2.0"
  attribution="Next 15 · Sanity · Tailwind 4"
/>`}</pre>
						</>
					) : null}

					{detailTab === "props" ? (
						<>
							<h3>Props at a glance</h3>
							<div className="props-table">
								{propsRows.map(([name, type, description], index) => (
									<div
										key={name}
										className="props-table__row"
										data-odd={index % 2 === 1}
									>
										<span>{name}</span>
										<span>{type}</span>
										<span>{description}</span>
									</div>
								))}
							</div>
						</>
					) : null}

					{detailTab === "tokens" ? (
						<>
							<h3>Footer tokens</h3>
							<div className="props-table">
								{tokenRows.map(([name, description], index) => (
									<div
										key={name}
										className="props-table__row props-table__row--token"
										data-odd={index % 2 === 1}
									>
										<span>{name}</span>
										<span>CSS var</span>
										<span>{description}</span>
									</div>
								))}
							</div>
						</>
					) : null}

					{detailTab === "source" ? (
						<>
							<h3>Source pattern</h3>
							<pre>{sourceSnippet}</pre>
						</>
					) : null}
				</div>
			</section>
		</main>
	)
}
