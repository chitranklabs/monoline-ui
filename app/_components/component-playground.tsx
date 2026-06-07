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
import { usePathname, useSearchParams } from "next/navigation"
import Prism from "prismjs"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-typescript"

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
	viewport: "desktop" as ViewportKey,
	theme: "light" as ThemeMode,
	zoom: 0.75,
}

function CodeBlock({
	code,
	language = "jsx",
}: {
	code: string
	language?: string
}) {
	const [copied, setCopied] = useState(false)

	const html = useMemo(() => {
		const lang = (Prism.languages[language] ||
			Prism.languages.javascript) as Prism.Grammar
		return Prism.highlight(code, lang, language)
	}, [code, language])

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(code)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error("Failed to copy code: ", err)
		}
	}

	return (
		<div className="code-block-wrapper">
			<button
				type="button"
				onClick={handleCopy}
				className="code-block-copy-btn ml-interaction-control"
				aria-label={copied ? "Copied" : "Copy code"}
			>
				{copied ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						style={{
							color: "var(--accent)",
							animation: "scale-in var(--duration-short) var(--ease-out-expo)",
						}}
					>
						<polyline points="20 6 9 17 4 12" />
					</svg>
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
						<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
					</svg>
				)}
			</button>
			<pre className={`language-${language}`}>
				<code
					className={`language-${language}`}
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</pre>
		</div>
	)
}

// Reusable PreviewFrame helper
interface PreviewFrameProps {
	children: ReactNode
	contentKey: string
	theme: ThemeMode
	viewportWidth: number
	zoom: number
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
		if (!iframe) return

		const iframeDocument = iframe.contentDocument
		if (!iframeDocument) return

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

		// Inject transition stylesheet for smooth theme toggles
		const styleNode = iframeDocument.createElement("style")
		styleNode.textContent = `
			* {
				transition: background-color var(--duration-medium) var(--ease-out),
				            color var(--duration-medium) var(--ease-out),
				            border-color var(--duration-medium) var(--ease-out);
			}
		`
		iframeDocument.head.appendChild(styleNode)

		setMountNode(
			iframeDocument.getElementById("playground-preview-root") as HTMLElement
		)
	}, [])

	useEffect(() => {
		const iframeDocument = iframeRef.current?.contentDocument
		if (iframeDocument) {
			iframeDocument.documentElement.dataset.theme = theme
		}
	}, [theme])

	useEffect(() => {
		if (!mountNode) return

		const iframeDocument = iframeRef.current?.contentDocument
		if (!iframeDocument) return

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
				title="Component preview"
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

export interface ComponentPlaygroundProps<T extends string = string> {
	title: string
	version?: string
	status?: string
	gzippedSize?: string
	description: ReactNode

	// Sizes/variants (optional)
	sizes?: T[]
	defaultSize?: T
	formatSize?: (size: T) => string

	// Render preview callback
	renderPreview: (size: T | undefined, theme: ThemeMode) => ReactNode

	// Documentation tabs
	importStatement: string
	usageCode: string
	props?: ReadonlyArray<readonly [string, string, string]>
	tokens?: ReadonlyArray<readonly [string, string]>
	sourceSnippet: string
}

function ComponentPlaygroundClient<T extends string = string>({
	title,
	version,
	status,
	gzippedSize,
	description,
	sizes,
	defaultSize,
	formatSize = (s) => s.toUpperCase(),
	renderPreview,
	importStatement,
	usageCode,
	props,
	tokens,
	sourceSnippet,
}: ComponentPlaygroundProps<T>) {
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const effectiveDefaultSize =
		defaultSize ?? (sizes && sizes.length > 0 ? sizes[0] : undefined)

	const parseRenderMode = (value: string | null): RenderMode => {
		return value === "all" ? "all" : defaultControls.render
	}

	const parseSize = (value: string | null): T | undefined => {
		if (!sizes) return undefined
		return sizes.includes(value as T) ? (value as T) : effectiveDefaultSize
	}

	const parseViewport = (value: string | null): ViewportKey => {
		return viewportOptions.some((option) => option.key === value)
			? (value as ViewportKey)
			: defaultControls.viewport
	}

	const parseTheme = (value: string | null): ThemeMode => {
		return value === "dark" ? "dark" : defaultControls.theme
	}

	const parseZoom = (value: string | null): number => {
		const parsed = Number(value)
		const matchedOption = zoomOptions.find(
			(option) => Math.round(option.value * 100) === parsed
		)
		return matchedOption?.value ?? defaultControls.zoom
	}

	const [renderMode, setRenderMode] = useState<RenderMode>(() =>
		parseRenderMode(searchParams.get("render"))
	)
	const [size, setSize] = useState<T | undefined>(() =>
		parseSize(searchParams.get("size"))
	)
	const [viewport, setViewport] = useState<ViewportKey>(() =>
		parseViewport(searchParams.get("viewport"))
	)
	const [theme, setTheme] = useState<ThemeMode>(() =>
		parseTheme(searchParams.get("theme"))
	)
	const [zoom, setZoom] = useState<number>(() =>
		parseZoom(searchParams.get("zoom"))
	)

	useEffect(() => {
		setRenderMode(parseRenderMode(searchParams.get("render")))
		setSize(parseSize(searchParams.get("size")))
		setViewport(parseViewport(searchParams.get("viewport")))
		setTheme(parseTheme(searchParams.get("theme")))
		setZoom(parseZoom(searchParams.get("zoom")))
	}, [searchParams])

	const viewportOption = useMemo(
		() =>
			(viewportOptions.find((option) => option.key === viewport) ??
				viewportOptions[2]) as ViewportOption,
		[viewport]
	)
	const zoomOption = useMemo(
		() =>
			(zoomOptions.find((option) => option.value === zoom) ??
				zoomOptions[1]) as ZoomOption,
		[zoom]
	)

	const renderedSizes = useMemo(() => {
		if (!sizes) return [undefined]
		return renderMode === "all" ? sizes : [size]
	}, [sizes, renderMode, size])

	const previewKey = `${renderMode}:${renderedSizes.join(",")}:${viewport}:${theme}`

	const setControl = (
		updates: Partial<{
			render: RenderMode
			size: T
			viewport: ViewportKey
			theme: ThemeMode
			zoom: number
		}>
	) => {
		if (updates.render !== undefined) setRenderMode(updates.render)
		if (updates.size !== undefined) setSize(updates.size)
		if (updates.viewport !== undefined) setViewport(updates.viewport)
		if (updates.theme !== undefined) setTheme(updates.theme)
		if (updates.zoom !== undefined) setZoom(updates.zoom)

		const nextState = {
			render: updates.render !== undefined ? updates.render : renderMode,
			size: updates.size !== undefined ? updates.size : size,
			viewport: updates.viewport !== undefined ? updates.viewport : viewport,
			theme: updates.theme !== undefined ? updates.theme : theme,
			zoom: updates.zoom !== undefined ? updates.zoom : zoom,
		}
		const nextParams = new URLSearchParams(window.location.search)

		const writeParam = <V extends string | number>(
			key: string,
			value: V | undefined,
			defaultValue: V | undefined
		) => {
			if (value === undefined || value === defaultValue) {
				nextParams.delete(key)
				return
			}
			nextParams.set(key, String(value))
		}

		writeParam("render", nextState.render, defaultControls.render)
		if (sizes) {
			writeParam("size", nextState.size, effectiveDefaultSize)
		} else {
			nextParams.delete("size")
		}
		writeParam("viewport", nextState.viewport, defaultControls.viewport)
		writeParam("theme", nextState.theme, defaultControls.theme)
		writeParam(
			"zoom",
			Math.round(nextState.zoom * 100),
			Math.round(defaultControls.zoom * 100)
		)

		for (const [key, value] of searchParams.entries()) {
			if (!["render", "size", "viewport", "theme", "zoom"].includes(key)) {
				nextParams.set(key, value)
			}
		}

		const queryString = nextParams.toString()
		const newUrl = queryString ? `${pathname}?${queryString}` : pathname
		window.history.replaceState(
			{ ...window.history.state, as: newUrl, url: newUrl },
			"",
			newUrl
		)
	}

	return (
		<main className="docs-page">
			<header className="docs-page__head docs-page__head--component">
				<p className="ml-eyebrow">Component</p>
				<div className="component-headline">
					<h1>{title}</h1>
					{status && (
						<span
							className={`playground-badge playground-badge--status playground-badge--${status.toLowerCase()}`}
						>
							{status === "stable" && (
								<span className="playground-badge__dot" />
							)}
							{status}
						</span>
					)}
					{version && (
						<span className="playground-badge playground-badge--version">
							{version}
						</span>
					)}
					{gzippedSize && (
						<span className="playground-badge playground-badge--size">
							{gzippedSize}
						</span>
					)}
				</div>
				<p>{description}</p>
			</header>

			<section className="playground-controls">
				{sizes && (
					<>
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
								{sizes.map((item) => (
									<button
										key={item}
										type="button"
										aria-pressed={size === item}
										className="ml-interaction-surface"
										onClick={() => {
											setControl({ render: "single", size: item })
										}}
									>
										{formatSize(item)}
									</button>
								))}
							</div>
						</div>
					</>
				)}

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
						{sizes
							? renderMode === "all"
								? "All sizes"
								: formatSize(size as T)
							: "Default"}{" "}
						· {zoomOption.label}
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
						{renderedSizes.map((s, idx) => (
							<div
								key={s ?? idx}
								className="playground-canvas__preview"
								data-size={s}
							>
								{renderPreview(s, theme)}
							</div>
						))}
					</PreviewFrame>
				</div>
			</section>

			<section className="docs-section">
				<div className="docs-subhead">
					<h2>Usage</h2>
					<p>How to import and use the component in your project.</p>
				</div>
				<h3>Import</h3>
				<CodeBlock code={importStatement} language="typescript" />

				<h3>Basic usage</h3>
				<CodeBlock code={usageCode} language="jsx" />
			</section>

			{props && props.length > 0 && (
				<section className="docs-section">
					<div className="docs-subhead">
						<h2>API Reference</h2>
						<p>Properties and callbacks supported by this component.</p>
					</div>
					<div className="props-table">
						{props.map(([name, type, desc], index) => (
							<div
								key={name}
								className="props-table__row"
								data-odd={index % 2 === 1}
							>
								<span>{name}</span>
								<span>{type}</span>
								<span>{desc}</span>
							</div>
						))}
					</div>
				</section>
			)}

			{tokens && tokens.length > 0 && (
				<section className="docs-section">
					<div className="docs-subhead">
						<h2>Design Tokens</h2>
						<p>CSS custom properties available for styling customizations.</p>
					</div>
					<div className="props-table">
						{tokens.map(([name, desc], index) => (
							<div
								key={name}
								className="props-table__row props-table__row--token"
								data-odd={index % 2 === 1}
							>
								<span>{name}</span>
								<span>CSS var</span>
								<span>{desc}</span>
							</div>
						))}
					</div>
				</section>
			)}

			<section className="docs-section">
				<div className="docs-subhead">
					<h2>Implementation</h2>
					<p>The raw source code pattern for reference or manual copy.</p>
				</div>
				<CodeBlock code={sourceSnippet} language="jsx" />
			</section>
		</main>
	)
}

export function ComponentPlayground<T extends string = string>(
	props: ComponentPlaygroundProps<T>
) {
	return (
		<Suspense
			fallback={
				<div
					style={{
						padding: "40px",
						textAlign: "center",
						color: "var(--text-muted)",
						fontFamily: "var(--font-mono)",
					}}
				>
					Loading playground...
				</div>
			}
		>
			<ComponentPlaygroundClient {...props} />
		</Suspense>
	)
}
