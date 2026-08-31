"use client"

import { useState } from "react"

import Link from "next/link"

import { Badge } from "@chitrank2050/monoline-ui/badge"
import { Button } from "@chitrank2050/monoline-ui/button"
import { Callout } from "@chitrank2050/monoline-ui/callout"
import { Checkbox } from "@chitrank2050/monoline-ui/checkbox"
import { Input } from "@chitrank2050/monoline-ui/input"
import { Metric } from "@chitrank2050/monoline-ui/metric"
import { SegmentedControl } from "@chitrank2050/monoline-ui/segmented-control"
import { Status } from "@chitrank2050/monoline-ui/status"
import { Toggle } from "@chitrank2050/monoline-ui/toggle"

type Category = "all" | "forms" | "display" | "feedback" | "editorial"

const categories: { id: Category; label: string }[] = [
	{ id: "all", label: "All Components" },
	{ id: "forms", label: "Forms & Inputs" },
	{ id: "display", label: "Display & Stats" },
	{ id: "feedback", label: "Feedback & Status" },
	{ id: "editorial", label: "Editorial & Content" },
]

export function HomeComponentGallery() {
	const [activeCategory, setActiveCategory] = useState<Category>("all")
	const [toggle1, setToggle1] = useState(true)
	const [toggle2, setToggle2] = useState(false)
	const [check1, setCheck1] = useState(true)
	const [segVal, setSegVal] = useState("daily")

	const showForms = activeCategory === "all" || activeCategory === "forms"
	const showDisplay = activeCategory === "all" || activeCategory === "display"
	const showFeedback = activeCategory === "all" || activeCategory === "feedback"
	const showEditorial =
		activeCategory === "all" || activeCategory === "editorial"

	return (
		<div className="flex flex-col gap-8">
			{/* Category Filter Bar */}
			<div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
				<div className="flex flex-wrap items-center gap-1.5">
					{categories.map((cat) => (
						<button
							key={cat.id}
							type="button"
							onClick={() => setActiveCategory(cat.id)}
							className={`cursor-pointer rounded-lg px-3 py-1.5 font-mono text-xs font-semibold tracking-eyebrow uppercase transition-all duration-(--duration-fast) ease-(--ease-out) ${
								activeCategory === cat.id
									? "bg-text text-background shadow-xs"
									: "bg-surface-2/60 text-text-secondary hover:bg-surface-2 hover:text-text"
							}`}
						>
							{cat.label}
						</button>
					))}
				</div>

				<Link
					href="/components"
					className="group inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-accent no-underline hover:underline"
				>
					View all 47 components
					<span className="transition-transform group-hover:translate-x-0.5">
						→
					</span>
				</Link>
			</div>

			{/* Interactive Component Grid */}
			<div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
				{/* 1. Buttons Showcase */}
				{showForms && (
					<div className="group relative flex flex-col justify-between border border-border rounded-xl bg-surface p-5 transition-all duration-(--duration-fast) ease-(--ease-out) hover:border-border-strong hover:shadow-md">
						<div>
							<div className="flex items-center justify-between pb-3">
								<span className="font-mono text-3xs font-semibold uppercase tracking-eyebrow text-text-muted">
									Button
								</span>
								<Link
									href="/components/button"
									className="text-3xs font-mono uppercase text-accent hover:underline"
								>
									Docs →
								</Link>
							</div>
							<div className="flex flex-wrap items-center gap-2 pt-2">
								<Button size="sm">Primary</Button>
								<Button size="sm" variant="secondary">
									Secondary
								</Button>
								<Button size="sm" variant="ghost">
									Ghost
								</Button>
								<Button size="sm" pill>
									Pill Mode
								</Button>
							</div>
						</div>
						<div className="mt-5 border-t border-border/60 pt-3">
							<p className="m-0 font-mono text-3xs text-text-muted">
								Supports asChild, icon slots, and token-backed active states.
							</p>
						</div>
					</div>
				)}

				{/* 2. Toggle & Checkbox Showcase */}
				{showForms && (
					<div className="group relative flex flex-col justify-between border border-border rounded-xl bg-surface p-5 transition-all duration-(--duration-fast) ease-(--ease-out) hover:border-border-strong hover:shadow-md">
						<div>
							<div className="flex items-center justify-between pb-3">
								<span className="font-mono text-3xs font-semibold uppercase tracking-eyebrow text-text-muted">
									Toggle & Checkbox
								</span>
								<Link
									href="/components/toggle"
									className="text-3xs font-mono uppercase text-accent hover:underline"
								>
									Docs →
								</Link>
							</div>
							<div className="flex flex-col gap-3 pt-2">
								<div className="flex items-center justify-between">
									<span className="text-xs text-text-secondary">
										Strict typing
									</span>
									<Toggle
										size="sm"
										checked={toggle1}
										onCheckedChange={setToggle1}
									/>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-xs text-text-secondary">
										Animated state
									</span>
									<Toggle
										size="sm"
										checked={toggle2}
										onCheckedChange={setToggle2}
									/>
								</div>
								<div className="flex items-center gap-2.5 pt-1">
									<Checkbox
										checked={check1}
										onCheckedChange={(v) => setCheck1(!!v)}
										id="chk1"
									/>
									<label
										htmlFor="chk1"
										className="cursor-pointer text-xs text-text-secondary"
									>
										OKLCH tokens enabled
									</label>
								</div>
							</div>
						</div>
						<div className="mt-5 border-t border-border/60 pt-3">
							<p className="m-0 font-mono text-3xs text-text-muted">
								WAI-ARIA switch semantics with hairline border alignment.
							</p>
						</div>
					</div>
				)}

				{/* 3. Segmented Control */}
				{showForms && (
					<div className="group relative flex flex-col justify-between border border-border rounded-xl bg-surface p-5 transition-all duration-(--duration-fast) ease-(--ease-out) hover:border-border-strong hover:shadow-md">
						<div>
							<div className="flex items-center justify-between pb-3">
								<span className="font-mono text-3xs font-semibold uppercase tracking-eyebrow text-text-muted">
									SegmentedControl
								</span>
								<Link
									href="/components/segmented-control"
									className="text-3xs font-mono uppercase text-accent hover:underline"
								>
									Docs →
								</Link>
							</div>
							<div className="pt-2">
								<SegmentedControl
									size="sm"
									options={[
										{ value: "daily", label: "Daily" },
										{ value: "weekly", label: "Weekly" },
										{ value: "monthly", label: "Monthly" },
									]}
									value={segVal}
									onChange={setSegVal}
								/>
							</div>
							<div className="pt-3">
								<Input
									size="sm"
									placeholder="Filter releases..."
									autoComplete="off"
									data-1p-ignore
									data-lpignore="true"
								/>
							</div>
						</div>
						<div className="mt-5 border-t border-border/60 pt-3">
							<p className="m-0 font-mono text-3xs text-text-muted">
								Roving keyboard navigation with spring-inspired pill physics.
							</p>
						</div>
					</div>
				)}

				{/* 4. Metric & Stats */}
				{showDisplay && (
					<div className="group relative flex flex-col justify-between border border-border rounded-xl bg-surface p-5 transition-all duration-(--duration-fast) ease-(--ease-out) hover:border-border-strong hover:shadow-md">
						<div>
							<div className="flex items-center justify-between pb-3">
								<span className="font-mono text-3xs font-semibold uppercase tracking-eyebrow text-text-muted">
									Metric
								</span>
								<Link
									href="/components/metric"
									className="text-3xs font-mono uppercase text-accent hover:underline"
								>
									Docs →
								</Link>
							</div>
							<div className="grid grid-cols-2 gap-3 pt-1">
								<Metric
									size="sm"
									value="0 ms"
									label="Runtime CSS"
									trend="flat"
								/>
								<Metric size="sm" value="100%" label="Accessible" trend="up" />
							</div>
						</div>
						<div className="mt-5 border-t border-border/60 pt-3">
							<p className="m-0 font-mono text-3xs text-text-muted">
								Compact typography and trend indicators for dashboards &
								portfolios.
							</p>
						</div>
					</div>
				)}

				{/* 5. Status & Badges */}
				{showFeedback && (
					<div className="group relative flex flex-col justify-between border border-border rounded-xl bg-surface p-5 transition-all duration-(--duration-fast) ease-(--ease-out) hover:border-border-strong hover:shadow-md">
						<div>
							<div className="flex items-center justify-between pb-3">
								<span className="font-mono text-3xs font-semibold uppercase tracking-eyebrow text-text-muted">
									Status & Badges
								</span>
								<Link
									href="/components/status"
									className="text-3xs font-mono uppercase text-accent hover:underline"
								>
									Docs →
								</Link>
							</div>
							<div className="flex flex-col gap-2.5 pt-1">
								<div className="flex items-center gap-2">
									<Status variant="accent" size="sm" animate>
										Operational
									</Status>
									<Status variant="muted" size="sm">
										Standby
									</Status>
									<Status variant="success" size="sm">
										Healthy
									</Status>
								</div>
								<div className="flex flex-wrap items-center gap-1.5 pt-1">
									<Badge variant="accent" size="sm">
										Tailwind v4
									</Badge>
									<Badge variant="muted" size="sm">
										React 19
									</Badge>
									<Badge variant="outline" size="sm">
										OKLCH
									</Badge>
									<Badge variant="solid" size="sm">
										v1.0.0
									</Badge>
								</div>
							</div>
						</div>
						<div className="mt-5 border-t border-border/60 pt-3">
							<p className="m-0 font-mono text-3xs text-text-muted">
								Stable indicator dot with subtle pulse animation and tone
								variants.
							</p>
						</div>
					</div>
				)}

				{/* 6. Callout & Quotes */}
				{showEditorial && (
					<div className="group relative flex flex-col justify-between border border-border rounded-xl bg-surface p-5 transition-all duration-(--duration-fast) ease-(--ease-out) hover:border-border-strong hover:shadow-md">
						<div>
							<div className="flex items-center justify-between pb-3">
								<span className="font-mono text-3xs font-semibold uppercase tracking-eyebrow text-text-muted">
									Callout
								</span>
								<Link
									href="/components/callout"
									className="text-3xs font-mono uppercase text-accent hover:underline"
								>
									Docs →
								</Link>
							</div>
							<div className="pt-1">
								<Callout variant="tip" label="Tailwind v4 native">
									Built directly on standard CSS variables without heavy
									JavaScript abstractions.
								</Callout>
							</div>
						</div>
						<div className="mt-5 border-t border-border/60 pt-3">
							<p className="m-0 font-mono text-3xs text-text-muted">
								Editorial notes, warnings, and tips with razor-thin leading
								accents.
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
