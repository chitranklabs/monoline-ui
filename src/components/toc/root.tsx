"use client"

import { useEffect, useState } from "react"

import { cn } from "../../lib/utils"
import { Eyebrow } from "../eyebrow"
import type { TocProps } from "./types"

export function TocRoot({
	className,
	items,
	activeId: controlledActive,
	heading = "On this page",
	scrollOffset = 80,
	collapsible = false,
	defaultOpen = false,
	ref,
	...props
}: TocProps): React.ReactElement {
	const [observedActive, setObservedActive] = useState<string | null>(null)
	const [open, setOpen] = useState(defaultOpen)
	const active = controlledActive ?? observedActive ?? items[0]?.id

	useEffect(() => {
		if (controlledActive !== undefined) return
		const nodes = items
			.map(({ id }) => document.getElementById(id))
			.filter((n): n is HTMLElement => !!n)
		if (nodes.length === 0) return

		const io = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort(
						(a, b) => a.boundingClientRect.top - b.boundingClientRect.top
					)[0]
				if (visible) setObservedActive(visible.target.id)
			},
			{
				rootMargin: `-${scrollOffset}px 0px -60% 0px`,
				threshold: [0, 1],
			}
		)
		for (const n of nodes) io.observe(n)
		return () => io.disconnect()
	}, [items, controlledActive, scrollOffset])

	const renderList = () => (
		<ol className="ml-toc m-0 flex list-none flex-col gap-0.5 p-0">
			{items.map((it, i) => {
				const isActive = it.id === active
				return (
					<li key={it.id}>
						<a
							href={`#${it.id}`}
							data-active={isActive}
							className={cn(
								"ml-toc__link flex cursor-pointer items-start gap-2.5 border-l-2 border-transparent py-1.5 pl-3 text-[13px] no-underline transition-[border-color,color] duration-(--duration-short)",
								"text-text-secondary hover:text-text",
								"data-[active=true]:border-l-accent data-[active=true]:text-text"
							)}
						>
							<span
								className={cn(
									"w-3.5 shrink-0 font-mono text-[10px]",
									isActive ? "text-accent" : "text-text-muted"
								)}
							>
								{String(i + 1).padStart(2, "0")}
							</span>
							<span className="leading-[1.4]">{it.label}</span>
						</a>
					</li>
				)
			})}
		</ol>
	)

	if (collapsible) {
		const displayHeading = heading || `On this page · ${items.length} sections`
		return (
			<div
				className={cn(
					"rounded-lg border border-border bg-card p-4 transition-colors",
					className
				)}
			>
				<button
					type="button"
					onClick={() => setOpen(!open)}
					className="flex w-full cursor-pointer items-center justify-between rounded-sm focus-visible:outline-none focus-visible:shadow-(--focus-ring)"
				>
					{typeof displayHeading === "string" ? (
						<Eyebrow className="m-0">{displayHeading}</Eyebrow>
					) : (
						displayHeading
					)}
					<span
						className="font-mono text-[11px] text-text-muted select-none transition-transform duration-(--duration-short) ease-(--ease-out)"
						style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
					>
						▸
					</span>
				</button>
				<div
					className={cn(
						"mt-3 grid transition-[grid-template-rows,opacity] duration-(--duration-short) ease-(--ease-out)",
						open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
					)}
				>
					<div className="overflow-hidden">
						<nav ref={ref} className="flex flex-col" {...props}>
							{renderList()}
						</nav>
					</div>
				</div>
			</div>
		)
	}

	return (
		<nav ref={ref} className={cn("flex flex-col", className)} {...props}>
			{heading && <Eyebrow className="mb-3">{heading}</Eyebrow>}
			{renderList()}
		</nav>
	)
}
