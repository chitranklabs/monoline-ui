"use client"

import {
	type ReactNode,
	Suspense,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import { createPortal } from "react-dom"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { SegmentedControl } from "@chitrank2050/monoline-ui/segmented-control"

import { CodeBlock } from "./code-block"

export { CodeBlock }

type RenderMode = "single" | "all"
type ThemeMode = "light" | "dark"
type PreviewLayout = "fit" | "viewport"
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
	zoom: 1,
}

const previewFrameMinWidth = 240
const previewFrameMinHeight = 96

// Reusable PreviewFrame helper
interface PreviewFrameProps {
	children: ReactNode
	contentKey: string
	layout: PreviewLayout
	theme: ThemeMode
	viewportWidth: number
	zoom: number
}

function PreviewFrame({
	children,
	contentKey,
	layout,
	theme,
	viewportWidth,
	zoom,
}: PreviewFrameProps) {
	const iframeRef = useRef<HTMLIFrameElement>(null)
	const [mountNode, setMountNode] = useState<HTMLElement | null>(null)
	const [frameSize, setFrameSize] = useState({
		width: viewportWidth,
		height: previewFrameMinHeight,
	})

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

		setFrameSize({
			width: viewportWidth,
			height: previewFrameMinHeight,
		})

		const updateHeight = () => {
			const contentRect = mountNode.getBoundingClientRect()
			const childWidths = Array.from(mountNode.children, (child) => {
				const element = child as HTMLElement
				return Math.max(
					Math.ceil(element.getBoundingClientRect().width),
					element.scrollWidth
				)
			})
			const contentWidth =
				childWidths.length > 0 ? Math.max(...childWidths) : contentRect.width
			const nextWidth =
				layout === "viewport"
					? viewportWidth
					: Math.min(
							viewportWidth,
							Math.max(previewFrameMinWidth, contentWidth)
						)
			const nextHeight = Math.max(
				previewFrameMinHeight,
				Math.ceil(contentRect.height),
				mountNode.scrollHeight
			)
			setFrameSize((current) =>
				current.width === nextWidth && current.height === nextHeight
					? current
					: { width: nextWidth, height: nextHeight }
			)
		}
		const observer = new ResizeObserver(updateHeight)
		const frame = requestAnimationFrame(updateHeight)

		observer.observe(mountNode)
		updateHeight()

		return () => {
			cancelAnimationFrame(frame)
			observer.disconnect()
		}
	}, [contentKey, layout, mountNode, viewportWidth])

	return (
		<div
			className="playground-canvas__stage"
			style={{
				width: frameSize.width * zoom,
				height: frameSize.height * zoom,
			}}
		>
			<iframe
				ref={iframeRef}
				title="Component preview"
				className="playground-canvas__frame"
				style={{
					width: frameSize.width,
					height: frameSize.height,
					transform: `scale(${zoom})`,
				}}
			/>
			{mountNode ? createPortal(children, mountNode) : null}
		</div>
	)
}

export interface ComponentPlaygroundProps<T extends string = string> {
	title: string
	description: ReactNode

	// Sizes/variants (optional)
	sizes?: T[]
	defaultSize?: T
	formatSize?: (size: T) => string

	// Render preview callback
	renderPreview: (size: T | undefined, theme: ThemeMode) => ReactNode
	previewLayout?: PreviewLayout

	// Documentation tabs
	importStatement: string
	usageCode: string
	props?: ReadonlyArray<readonly [string, string, string]>
	tokens?: ReadonlyArray<readonly [string, string]>
	sourceSnippet: string
}

function ComponentPlaygroundClient<T extends string = string>({
	title,
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
	previewLayout = "fit",
}: ComponentPlaygroundProps<T>) {
	const pathname = usePathname()
	const router = useRouter()
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

	const renderMode = parseRenderMode(searchParams.get("render"))
	const size = parseSize(searchParams.get("size"))
	const viewport = parseViewport(searchParams.get("viewport"))
	const theme = parseTheme(searchParams.get("theme"))
	const zoom = parseZoom(searchParams.get("zoom"))

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
		const nextState = {
			render: updates.render !== undefined ? updates.render : renderMode,
			size: updates.size !== undefined ? updates.size : size,
			viewport: updates.viewport !== undefined ? updates.viewport : viewport,
			theme: updates.theme !== undefined ? updates.theme : theme,
			zoom: updates.zoom !== undefined ? updates.zoom : zoom,
		}
		const nextParams = new URLSearchParams(searchParams.toString())

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
					<h1>{title}</h1>
				</div>
				<p>{description}</p>
			</header>

			<section className="playground-controls">
				{sizes && (
					<>
						<div className="playground-controls__group">
							<label>Render</label>
							<SegmentedControl
								variant="default"
								options={[
									{ value: "single", label: "Single" },
									{ value: "all", label: "All sizes" },
								]}
								value={renderMode}
								onChange={(val) => setControl({ render: val })}
							/>
						</div>

						<div className="playground-controls__group">
							<label>Size</label>
							<SegmentedControl
								variant="default"
								options={sizes.map((item) => ({
									value: item,
									label: formatSize(item),
								}))}
								value={size ?? sizes[0] ?? ""}
								onChange={(val) =>
									setControl({ render: "single", size: val as T })
								}
							/>
						</div>
					</>
				)}

				<div className="playground-controls__group">
					<label>Viewport</label>
					<SegmentedControl
						variant="default"
						options={viewportOptions.map((option) => ({
							value: option.key,
							label: option.label,
						}))}
						value={viewport}
						onChange={(val) => setControl({ viewport: val })}
					/>
				</div>

				<div className="playground-controls__group">
					<label>Theme</label>
					<SegmentedControl
						variant="default"
						options={[
							{ value: "light", label: "Light" },
							{ value: "dark", label: "Dark" },
						]}
						value={theme}
						onChange={(val) => setControl({ theme: val })}
					/>
				</div>

				<div className="playground-controls__group">
					<label>Zoom</label>
					<SegmentedControl
						variant="default"
						options={zoomOptions.map((option) => ({
							value: String(option.value),
							label: option.label,
						}))}
						value={String(zoom)}
						onChange={(val) => setControl({ zoom: Number(val) })}
					/>
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
						layout={previewLayout}
						theme={theme}
						viewportWidth={viewportOption.width}
						zoom={zoom}
					>
						{renderedSizes.map((s, idx) => (
							<div
								key={s ?? idx}
								className="playground-canvas__preview"
								data-layout={previewLayout}
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
					Loading playground…
				</div>
			}
		>
			<ComponentPlaygroundClient {...props} />
		</Suspense>
	)
}
