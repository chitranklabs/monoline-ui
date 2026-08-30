"use client"

/* eslint-disable jsx-a11y/label-has-associated-control */
import {
	type ReactNode,
	Suspense,
	startTransition,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { DataList } from "@chitrank2050/monoline-ui/data-list"
import { LinkList } from "@chitrank2050/monoline-ui/link-list"
import { SegmentedControl } from "@chitrank2050/monoline-ui/segmented-control"

import {
	type ComponentSlug,
	componentGuidance,
} from "../lib/component-guidance"
import { CodeBlock } from "./code-block"
import JsonLd, {
	createBreadcrumbJsonLd,
	createTechArticleJsonLd,
} from "./json-ld"

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

interface PlaygroundControlState<
	TSize extends string = string,
	TVariant extends string = string,
> {
	render: RenderMode
	size: TSize | undefined
	variant: TVariant | undefined
	viewport: ViewportKey
	theme: ThemeMode
	zoom: number
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
const defaultViewportOption = viewportOptions[2] as ViewportOption

const previewFrameMinHeight = 320

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
	const previewRef = useRef<HTMLDivElement>(null)
	const [frameHeight, setFrameHeight] = useState(previewFrameMinHeight)

	useLayoutEffect(() => {
		const mountNode = previewRef.current
		if (!mountNode) return

		const measure = () => {
			const next = Math.max(previewFrameMinHeight, mountNode.scrollHeight)
			setFrameHeight((h) => (h === next ? h : next))
		}

		const observer = new ResizeObserver(measure)
		const raf = requestAnimationFrame(measure)
		observer.observe(mountNode)
		measure()

		return () => {
			cancelAnimationFrame(raf)
			observer.disconnect()
		}
	}, [contentKey, viewportWidth])

	return (
		<div
			className="playground-canvas__stage"
			style={{
				width: viewportWidth * zoom,
				height: frameHeight * zoom,
			}}
		>
			<div
				ref={previewRef}
				data-theme={theme}
				className="playground-canvas__frame"
				style={{
					width: viewportWidth,
					height: frameHeight,
					transform: `scale(${zoom})`,
				}}
			>
				{children}
			</div>
		</div>
	)
}

export interface ComponentPlaygroundProps<
	TSize extends string = string,
	TVariant extends string = string,
> {
	title: string
	description: ReactNode
	slug?: ComponentSlug
	seoDescription?: string

	// Sizes (optional)
	sizes?: TSize[]
	defaultSize?: TSize
	formatSize?: (size: TSize) => string
	renderControlLabel?: string
	sizeControlLabel?: string
	allSizesLabel?: string

	// Variants (optional)
	variants?: TVariant[]
	defaultVariant?: TVariant
	formatVariant?: (variant: TVariant) => string

	// Render preview callback
	renderPreview: (
		size: TSize | undefined,
		theme: ThemeMode,
		variant: TVariant | undefined
	) => ReactNode
	previewLayout?: PreviewLayout

	// Documentation tabs
	importStatement: string
	usageCode: string
	props?: ReadonlyArray<readonly [string, string, string]>
	tokens?: ReadonlyArray<readonly [string, string]>
	sourceSnippet: string
}

function InteractivePlayground<
	TSize extends string = string,
	TVariant extends string = string,
>({
	sizes,
	defaultSize,
	formatSize = (s) => s.toUpperCase(),
	renderControlLabel = "Render",
	sizeControlLabel = "Size",
	allSizesLabel = "All sizes",
	variants,
	defaultVariant,
	formatVariant = (v) => v.charAt(0).toUpperCase() + v.slice(1),
	renderPreview,
	previewLayout = "fit",
}: ComponentPlaygroundProps<TSize, TVariant>) {
	const pathname = usePathname()
	const router = useRouter()
	const searchParams = useSearchParams()
	const hasViewportControl = previewLayout === "viewport"

	const effectiveDefaultSize =
		defaultSize ?? (sizes && sizes.length > 0 ? sizes[0] : undefined)

	const effectiveDefaultVariant =
		defaultVariant ??
		(variants && variants.length > 0 ? variants[0] : undefined)

	const parseRenderMode = (value: string | null): RenderMode => {
		return value === "all" ? "all" : defaultControls.render
	}

	const parseSize = (value: string | null): TSize | undefined => {
		if (!sizes) return undefined
		return sizes.includes(value as TSize)
			? (value as TSize)
			: effectiveDefaultSize
	}

	const parseVariant = (value: string | null): TVariant | undefined => {
		if (!variants) return undefined
		return variants.includes(value as TVariant)
			? (value as TVariant)
			: effectiveDefaultVariant
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

	const urlState: PlaygroundControlState<TSize, TVariant> = {
		render: parseRenderMode(searchParams.get("render")),
		size: parseSize(searchParams.get("size")),
		variant: parseVariant(searchParams.get("variant")),
		viewport: parseViewport(searchParams.get("viewport")),
		theme: parseTheme(searchParams.get("theme")),
		zoom: parseZoom(searchParams.get("zoom")),
	}
	const [controlState, setControlState] =
		useState<PlaygroundControlState<TSize, TVariant>>(urlState)

	useEffect(() => {
		setControlState((current) =>
			current.render === urlState.render &&
			current.size === urlState.size &&
			current.variant === urlState.variant &&
			current.viewport === urlState.viewport &&
			current.theme === urlState.theme &&
			current.zoom === urlState.zoom
				? current
				: urlState
		)
	}, [
		urlState.render,
		urlState.size,
		urlState.variant,
		urlState.viewport,
		urlState.theme,
		urlState.zoom,
	])

	const { render, size, variant, viewport, theme, zoom } = controlState

	const viewportOption = useMemo(
		() =>
			(viewportOptions.find((option) => option.key === viewport) ??
				defaultViewportOption) as ViewportOption,
		[viewport]
	)
	const activeViewportOption = hasViewportControl
		? viewportOption
		: defaultViewportOption
	const zoomOption = useMemo(
		() =>
			(zoomOptions.find((option) => option.value === zoom) ??
				zoomOptions[1]) as ZoomOption,
		[zoom]
	)

	const renderedSizes = useMemo(() => {
		if (!sizes) return [undefined]
		return render === "all" ? sizes : [size]
	}, [sizes, render, size])

	const previewKey = `${render}:${renderedSizes.join(",")}:${activeViewportOption.key}:${theme}:${variant ?? ""}`

	const setControl = (
		updates: Partial<{
			render: RenderMode
			size: TSize
			variant: TVariant
			viewport: ViewportKey
			theme: ThemeMode
			zoom: number
		}>
	) => {
		const nextState = {
			render: updates.render !== undefined ? updates.render : render,
			size: updates.size !== undefined ? updates.size : size,
			variant: updates.variant !== undefined ? updates.variant : variant,
			viewport: updates.viewport !== undefined ? updates.viewport : viewport,
			theme: updates.theme !== undefined ? updates.theme : theme,
			zoom: updates.zoom !== undefined ? updates.zoom : zoom,
		}
		setControlState(nextState)

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
		if (variants) {
			writeParam("variant", nextState.variant, effectiveDefaultVariant)
		} else {
			nextParams.delete("variant")
		}
		if (hasViewportControl) {
			writeParam("viewport", nextState.viewport, defaultControls.viewport)
		} else {
			nextParams.delete("viewport")
		}
		writeParam("theme", nextState.theme, defaultControls.theme)
		writeParam(
			"zoom",
			Math.round(nextState.zoom * 100),
			Math.round(defaultControls.zoom * 100)
		)

		const queryString = nextParams.toString()
		startTransition(() => {
			router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
				scroll: false,
			})
		})
	}

	return (
		<>
			<section className="playground-controls">
				{sizes && (
					<>
						<div className="playground-controls__group">
							<label>{renderControlLabel}</label>
							<SegmentedControl
								variant="default"
								options={[
									{ value: "single", label: "Single" },
									{ value: "all", label: allSizesLabel },
								]}
								value={render}
								onChange={(val) => setControl({ render: val })}
							/>
						</div>

						<div className="playground-controls__group">
							<label>{sizeControlLabel}</label>
							<SegmentedControl
								variant="default"
								options={sizes.map((item) => ({
									value: item,
									label: formatSize(item),
								}))}
								value={size ?? sizes[0] ?? ""}
								onChange={(val) =>
									setControl({ render: "single", size: val as TSize })
								}
							/>
						</div>
					</>
				)}

				{variants && (
					<div className="playground-controls__group">
						<label>Variant</label>
						<SegmentedControl
							variant="default"
							options={variants.map((item) => ({
								value: item,
								label: formatVariant(item),
							}))}
							value={variant ?? variants[0] ?? ""}
							onChange={(val) => setControl({ variant: val as TVariant })}
						/>
					</div>
				)}

				{hasViewportControl && (
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
				)}

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
							? render === "all"
								? allSizesLabel
								: formatSize(size as TSize)
							: "Default"}{" "}
						{variants && variant ? ` · ${formatVariant(variant)}` : ""} ·{" "}
						{zoomOption.label}
					</span>
					<span>
						{hasViewportControl
							? `${activeViewportOption.label} · ${activeViewportOption.width}px · `
							: ""}
						{theme}
					</span>
				</div>
				<div className="playground-canvas__viewport">
					<PreviewFrame
						contentKey={previewKey}
						theme={theme}
						viewportWidth={activeViewportOption.width}
						zoom={zoom}
					>
						{renderedSizes.map((s, idx) => (
							<div
								key={s ?? idx}
								className="playground-canvas__preview"
								data-layout={previewLayout}
								data-size={s}
							>
								{renderPreview(s, theme, variant)}
							</div>
						))}
					</PreviewFrame>
				</div>
			</section>
		</>
	)
}

export function ComponentPlayground<
	TSize extends string = string,
	TVariant extends string = string,
>(props: ComponentPlaygroundProps<TSize, TVariant>) {
	const {
		title,
		description,
		slug,
		seoDescription,
		importStatement,
		usageCode,
		props: propRows,
		tokens,
		sourceSnippet,
	} = props
	const componentSlug = slug ?? toComponentSlug(title)
	const guidance = componentGuidance[componentSlug]
	const descriptionText =
		seoDescription ??
		(typeof description === "string"
			? description
			: `${title} usage, API, accessibility, runtime, and design-token guidance for Monoline UI.`)
	const componentPath = `/components/${componentSlug}` as const
	const runtimeLabel =
		guidance.runtime === "client" ? "Client Component" : "Server Component"
	const integrationGuidance = [
		{
			label: "01",
			title: "Good fit",
			description: guidance.whenToUse,
		},
		{
			label: "02",
			title: "Choose something else if",
			description: guidance.whenToAvoid,
		},
		{
			label: "03",
			title: "Accessibility",
			description: guidance.accessibility,
		},
		{
			label: "04",
			title: runtimeLabel,
			description:
				guidance.runtime === "client"
					? "This component needs browser JavaScript for state or browser APIs."
					: "This component can render without adding a Monoline client boundary when its children and props are serializable.",
		},
	]
	const relatedDocumentation = [
		...guidance.related.map((relatedSlug, index) => ({
			label: String(index + 1).padStart(2, "0"),
			date: "Component",
			title: `${formatComponentSlug(relatedSlug)} React component`,
			href: `/components/${relatedSlug}`,
			tag: "Reference",
			as: Link,
		})),
		{
			label: "03",
			date: "Setup",
			title: "Install Monoline UI",
			href: "/installation",
			tag: "Guide",
			as: Link,
		},
		{
			label: "04",
			date: "Theme",
			title: "Tailwind CSS v4 design tokens",
			href: "/foundations",
			tag: "Foundations",
			as: Link,
		},
	]
	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			createTechArticleJsonLd({
				title: `${title} React component`,
				description: descriptionText,
				path: componentPath,
			}),
			createBreadcrumbJsonLd([
				{ name: "Monoline UI", path: "/" },
				{ name: "React components", path: "/components" },
				{ name: title, path: componentPath },
			]),
		],
	}

	return (
		<main id="main-content" tabIndex={-1} className="docs-page">
			<JsonLd data={jsonLd} />
			<header className="docs-page__head docs-page__head--component">
				<p className="ml-eyebrow">Component</p>
				<div className="component-headline">
					<h1>{title} React component</h1>
				</div>
				<p>{description}</p>
			</header>

			<h2 className="sr-only">Interactive preview</h2>
			<Suspense
				fallback={
					<>
						<section className="playground-controls" aria-hidden="true" />
						<section
							className="playground-canvas"
							aria-busy="true"
							aria-label="Interactive component preview loading"
						>
							<div className="playground-canvas__meta" aria-hidden="true">
								<span>Preview</span>
								<span>Loading</span>
							</div>
							<div className="playground-canvas__viewport">
								<div
									aria-hidden="true"
									style={{
										width: "100%",
										minHeight: `${previewFrameMinHeight}px`,
									}}
								/>
							</div>
						</section>
					</>
				}
			>
				<InteractivePlayground {...props} />
			</Suspense>

			<section className="docs-section">
				<div className="docs-subhead">
					<h2>Usage</h2>
					<p>Install path and a minimal example you can paste into an app.</p>
				</div>
				<h3>Import</h3>
				<CodeBlock code={importStatement} language="typescript" />

				<h3>Basic usage</h3>
				<CodeBlock code={usageCode} language="jsx" />
			</section>

			<section className="docs-section" aria-labelledby="before-you-use-title">
				<div className="docs-subhead">
					<h2 id="before-you-use-title">Before you use it</h2>
					<p>
						Check the behavior, semantics, and runtime before adapting the
						visual layer.
					</p>
				</div>
				<DataList size="sm" variant="numbered" items={integrationGuidance} />
			</section>

			{propRows && propRows.length > 0 && (
				<section className="docs-section">
					<div className="docs-subhead">
						<h2>API Reference</h2>
						<p>Props, slots, and callbacks available on this component.</p>
					</div>
					<div className="props-table">
						{propRows.map(([name, type, desc], index) => (
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
						<p>
							Theme variables this component reads for color, spacing, and
							motion.
						</p>
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
					<p>
						The source used by the example above, including any state it needs.
					</p>
				</div>
				<CodeBlock code={sourceSnippet} language="jsx" />
			</section>

			<div className="docs-section">
				<div className="docs-subhead">
					<h2 id="related-documentation-title">Related documentation</h2>
					<p>Continue with nearby components, installation, and theming.</p>
				</div>
				<LinkList
					aria-labelledby="related-documentation-title"
					size="sm"
					title="Documentation map"
					action={<Link href="/components">View component catalog →</Link>}
					items={relatedDocumentation}
				/>
			</div>
		</main>
	)
}

function toComponentSlug(title: string): ComponentSlug {
	const candidate = title
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.toLowerCase() as ComponentSlug

	if (!(candidate in componentGuidance)) {
		throw new Error(`Missing integration guidance for ${title}`)
	}

	return candidate
}

function formatComponentSlug(slug: ComponentSlug) {
	return slug
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ")
}
