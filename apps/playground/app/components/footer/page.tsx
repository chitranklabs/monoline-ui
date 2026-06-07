"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"

import {
	Footer,
	type FooterSize,
} from "@chitrank2050/monoline-ui/components/footer"

type RenderMode = "single" | "all"
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

function formatSize(size: FooterSize) {
	return size.toUpperCase()
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

function PreviewFrame({
	children,
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
			const nextHeight = Math.max(
				456,
				mountNode.scrollHeight,
				iframeDocument.body.scrollHeight,
				iframeDocument.documentElement.scrollHeight
			)
			setContentHeight(nextHeight)
		}
		const observer = new ResizeObserver(updateHeight)

		observer.observe(mountNode)
		updateHeight()

		return () => {
			observer.disconnect()
		}
	}, [mountNode, viewportWidth, zoom])

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

export default function FooterPage() {
	const [renderMode, setRenderMode] = useState<RenderMode>("single")
	const [size, setSize] = useState<FooterSize>("md")
	const [viewport, setViewport] = useState<ViewportKey>("desktop")
	const [theme, setTheme] = useState<ThemeMode>("light")
	const [zoom, setZoom] = useState(0.75)

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
							onClick={() => setRenderMode("single")}
						>
							Single
						</button>
						<button
							type="button"
							aria-pressed={renderMode === "all"}
							className="ml-interaction-surface"
							onClick={() => setRenderMode("all")}
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
									setRenderMode("single")
									setSize(footerSize)
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
								onClick={() => setViewport(option.key)}
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
							onClick={() => setTheme("light")}
						>
							Light
						</button>
						<button
							type="button"
							aria-pressed={theme === "dark"}
							className="ml-interaction-surface"
							onClick={() => setTheme("dark")}
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
								onClick={() => setZoom(option.value)}
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
				<div className="playground-detail__tabs">
					<button
						type="button"
						aria-pressed="true"
						className="ml-interaction-tab-underline"
					>
						Usage
					</button>
					<button type="button" className="ml-interaction-tab-underline">
						Props
					</button>
					<button type="button" className="ml-interaction-tab-underline">
						Tokens
					</button>
					<button type="button" className="ml-interaction-tab-underline">
						Source
					</button>
				</div>
				<div className="playground-detail__body">
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
				</div>
			</section>
		</main>
	)
}
