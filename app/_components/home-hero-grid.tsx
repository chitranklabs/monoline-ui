"use client"

import { useState } from "react"

import Link from "next/link"

import { Avatar } from "@chitrank2050/monoline-ui/avatar"
import { Badge } from "@chitrank2050/monoline-ui/badge"
import { Button } from "@chitrank2050/monoline-ui/button"
import { Card } from "@chitrank2050/monoline-ui/card"
import { Checkbox } from "@chitrank2050/monoline-ui/checkbox"
import { Input } from "@chitrank2050/monoline-ui/input"
import { Label } from "@chitrank2050/monoline-ui/label"
import { Metric } from "@chitrank2050/monoline-ui/metric"
import { Progress } from "@chitrank2050/monoline-ui/progress"
import { SegmentedControl } from "@chitrank2050/monoline-ui/segmented-control"
import { Status } from "@chitrank2050/monoline-ui/status"
import { Tag } from "@chitrank2050/monoline-ui/tag"
import { Textarea } from "@chitrank2050/monoline-ui/textarea"
import { Toggle } from "@chitrank2050/monoline-ui/toggle"

export function HomeHeroGrid() {
	const [toggle1, setToggle1] = useState(true)
	const [toggle2, setToggle2] = useState(false)
	const [check1, setCheck1] = useState(true)
	const [check2, setCheck2] = useState(false)
	const [currency, setCurrency] = useState("usd")
	const [chatInput, setChatInput] = useState("")
	const [payoutInput, setPayoutInput] = useState("2,450.00")

	return (
		<div className="relative w-full overflow-hidden pt-ml-4">
			{/* 4-Column Responsive Grid of Live Monoline Components */}
			<div className="grid grid-cols-1 gap-ml-4 sm:grid-cols-2 lg:grid-cols-4 select-none">
				{/* ========================================================= */}
				{/* COLUMN 1: CONTROLS, NAVIGATION & AUDIENCE                 */}
				{/* ========================================================= */}
				<div className="flex flex-col gap-ml-4">
					{/* Interactive Quick Controls Card */}
					<div className="flex flex-col gap-ml-3 rounded-xl border border-border bg-surface p-ml-4 shadow-xs transition-colors hover:border-border-strong">
						<div className="flex flex-wrap items-center gap-ml-2">
							<Button size="sm">Button →</Button>
							<Button size="sm" variant="secondary">
								Secondary
							</Button>
							<Button size="sm" variant="ghost">
								Ghost
							</Button>
						</div>

						<Input
							size="sm"
							placeholder="Enter project name..."
							autoComplete="off"
							data-1p-ignore
							data-lpignore="true"
						/>
						<Textarea
							size="sm"
							rows={2}
							placeholder="Write a brief description..."
							autoComplete="off"
							data-1p-ignore
							data-lpignore="true"
						/>

						<div className="flex flex-wrap items-center justify-between gap-ml-2 border-t border-border/60 pt-ml-2-5">
							<div className="flex items-center gap-ml-1-5">
								<Badge variant="accent" size="sm">
									Badge
								</Badge>
								<Badge variant="outline" size="sm">
									Outline
								</Badge>
							</div>
							<div className="flex items-center gap-ml-2">
								<Toggle
									size="sm"
									checked={toggle1}
									onCheckedChange={setToggle1}
									aria-label="Toggle demo state"
								/>
								<Checkbox
									checked={check1}
									onCheckedChange={(v) => setCheck1(!!v)}
									aria-label="Checkbox demo state"
								/>
							</div>
						</div>
					</div>

					{/* Navigation Directory Widget */}
					<div className="flex flex-col rounded-xl border border-border bg-surface p-ml-4 shadow-xs transition-colors hover:border-border-strong">
						<div className="flex items-center justify-between pb-ml-3 border-b border-border">
							<span className="font-mono text-3xs font-semibold uppercase tracking-eyebrow text-text-muted">
								Workspace Directory
							</span>
							<Status variant="accent" size="sm" animate>
								Active
							</Status>
						</div>
						<div className="grid grid-cols-2 gap-ml-2 pt-ml-3">
							<div className="flex flex-col gap-ml-1-5 font-mono text-xs">
								<span className="text-3xs uppercase tracking-eyebrow text-text-muted font-bold">
									Documents
								</span>
								<Link
									href="/docs/components"
									className="text-text-secondary hover:text-text no-underline truncate transition-colors"
								>
									📄 Architecture
								</Link>
								<Link
									href="/docs/foundations"
									className="text-text-secondary hover:text-text no-underline truncate transition-colors"
								>
									🎨 Tokens
								</Link>
								<Link
									href="/docs/patterns"
									className="text-text-secondary hover:text-text no-underline truncate transition-colors"
								>
									🧩 Patterns
								</Link>
							</div>
							<div className="flex flex-col gap-ml-1-5 font-mono text-xs">
								<span className="text-3xs uppercase tracking-eyebrow text-text-muted font-bold">
									Settings
								</span>
								<span className="text-text-secondary truncate">
									⚙ Team Roles
								</span>
								<span className="text-text-secondary truncate">
									🔒 OKLCH Themes
								</span>
								<span className="text-text-secondary truncate">💳 Billing</span>
							</div>
						</div>
					</div>

					{/* Target Metrics Card */}
					<div className="flex flex-col gap-ml-3 rounded-xl border border-border bg-surface p-ml-4 shadow-xs transition-colors hover:border-border-strong">
						<div className="flex items-center justify-between">
							<span className="font-mono text-3xs font-semibold uppercase tracking-eyebrow text-text-muted">
								Quarterly Target
							</span>
							<Badge variant="accent" size="sm">
								ON TRACK
							</Badge>
						</div>
						<div>
							<div className="font-mono text-2xl font-bold tracking-tight text-text">
								$420,000
							</div>
							<p className="mt-ml-1 font-mono text-3xs text-text-muted">
								65% completed · $273,000 achieved
							</p>
						</div>
						<Progress value={65} size="sm" />
					</div>
				</div>

				{/* ========================================================= */}
				{/* COLUMN 2: FINANCIAL, TIMELINES & ARTICLES                 */}
				{/* ========================================================= */}
				<div className="flex flex-col gap-ml-4">
					{/* Activity Bar Chart Preview Card */}
					<div className="flex flex-col justify-between gap-ml-3 rounded-xl border border-border bg-surface p-ml-4 shadow-xs transition-colors hover:border-border-strong">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="m-0 text-xs font-bold font-mono tracking-tight text-text">
									Contribution Pulse
								</h3>
								<p className="m-0 font-mono text-3xs text-text-muted">
									Last 6 months velocity
								</p>
							</div>
							<Badge variant="outline" size="sm">
								+24.8%
							</Badge>
						</div>

						{/* Simulated Monospace Bar Rhythm */}
						<div className="flex items-end justify-between gap-ml-2 h-20 pt-ml-2 px-ml-1 border-b border-border pb-ml-2">
							{[
								{ label: "Dec", h: "45%" },
								{ label: "Jan", h: "75%" },
								{ label: "Feb", h: "60%" },
								{ label: "Mar", h: "95%" },
								{ label: "Apr", h: "50%" },
								{ label: "May", h: "85%" },
							].map((item) => (
								<div
									key={item.label}
									className="flex flex-1 flex-col items-center gap-ml-1-5 h-full justify-end"
								>
									<div
										className="w-full rounded-xs bg-text transition-all duration-300 hover:bg-accent"
										style={{ height: item.h }}
									/>
									<span className="font-mono text-4xs text-text-muted uppercase">
										{item.label}
									</span>
								</div>
							))}
						</div>

						<div className="flex items-center justify-between pt-ml-1">
							<div className="flex flex-col">
								<span className="font-mono text-3xs uppercase tracking-eyebrow text-text-muted">
									Releases
								</span>
								<span className="font-mono text-xs font-bold text-text">
									v0.4.0 Live
								</span>
							</div>
							<Button size="sm" variant="secondary" asChild>
								<Link href="/changelog">Changelog →</Link>
							</Button>
						</div>
					</div>

					{/* Claimable Balance Card */}
					<div className="flex flex-col gap-ml-3 rounded-xl border border-border bg-surface p-ml-4 shadow-xs transition-colors hover:border-border-strong">
						<div className="flex items-center justify-between">
							<span className="font-mono text-3xs font-semibold uppercase tracking-eyebrow text-text-muted">
								Claimable Balance
							</span>
							<Status variant="accent" size="sm" animate>
								Verified
							</Status>
						</div>

						<div className="font-mono text-3xl font-extrabold tracking-tight text-text">
							$1,211.29
						</div>

						<div className="flex flex-col gap-ml-1-5 border-t border-border/60 pt-ml-2 font-mono text-xs">
							<div className="flex items-center justify-between text-text-secondary">
								<span>Net Royalties</span>
								<span className="font-semibold text-text">$1,248.75</span>
							</div>
							<div className="flex items-center justify-between text-text-muted text-2xs">
								<span>Processing Fee</span>
								<span>-$37.46</span>
							</div>
						</div>

						<Button size="sm">Withdraw Funds</Button>
					</div>

					{/* Editorial Pull Quote Mini Card */}
					<div className="rounded-xl border border-border bg-surface-2/40 p-ml-4 shadow-xs">
						<span className="font-mono text-3xs font-semibold uppercase tracking-eyebrow text-accent">
							Editorial Craft
						</span>
						<p className="mt-ml-1 font-mono text-xs leading-relaxed text-text">
							"Design tokens should live in CSS, not locked in build
							configurations."
						</p>
					</div>
				</div>

				{/* ========================================================= */}
				{/* COLUMN 3: FORMS, PRESETS & MILESTONES                      */}
				{/* ========================================================= */}
				<div className="flex flex-col gap-ml-4">
					{/* Set Milestone Form */}
					<div className="flex flex-col gap-ml-3 rounded-xl border border-border bg-surface p-ml-4 shadow-xs transition-colors hover:border-border-strong">
						<div className="flex items-center justify-between border-b border-border pb-ml-2-5">
							<span className="font-mono text-3xs font-semibold uppercase tracking-eyebrow text-text-muted">
								Create Milestone
							</span>
							<Badge variant="outline" size="sm">
								Sprint 4
							</Badge>
						</div>

						<div className="flex flex-col gap-ml-2">
							<Label className="font-mono text-3xs uppercase tracking-eyebrow">
								Goal Name
							</Label>
							<Input
								size="sm"
								defaultValue="Type-safe BFF Rollout"
								autoComplete="off"
								data-1p-ignore
								data-lpignore="true"
							/>
						</div>

						<div className="grid grid-cols-2 gap-ml-2">
							<div className="flex flex-col gap-ml-1">
								<Label className="font-mono text-3xs uppercase tracking-eyebrow">
									Target ($)
								</Label>
								<Input
									size="sm"
									defaultValue="15,000"
									autoComplete="off"
									data-1p-ignore
									data-lpignore="true"
								/>
							</div>
							<div className="flex flex-col gap-ml-1">
								<Label className="font-mono text-3xs uppercase tracking-eyebrow">
									Timeline
								</Label>
								<Input
									size="sm"
									defaultValue="Q4 2026"
									autoComplete="off"
									data-1p-ignore
									data-lpignore="true"
								/>
							</div>
						</div>

						<div className="flex items-center gap-ml-2 pt-ml-1">
							<Button size="sm" className="flex-1">
								Save Goal
							</Button>
							<Button size="sm" variant="ghost">
								Cancel
							</Button>
						</div>
					</div>

					{/* Payout Currency & Threshold Selector */}
					<div className="flex flex-col gap-ml-3 rounded-xl border border-border bg-surface p-ml-4 shadow-xs transition-colors hover:border-border-strong">
						<div className="flex items-center justify-between">
							<span className="font-mono text-3xs font-semibold uppercase tracking-eyebrow text-text-muted">
								Payout Settings
							</span>
							<Toggle
								size="sm"
								checked={toggle2}
								onCheckedChange={setToggle2}
								aria-label="Toggle payout threshold state"
							/>
						</div>

						<SegmentedControl
							size="sm"
							options={[
								{ value: "usd", label: "USD ($)" },
								{ value: "eur", label: "EUR (€)" },
								{ value: "gbp", label: "GBP (£)" },
							]}
							value={currency}
							onChange={setCurrency}
						/>

						<div className="flex flex-col gap-ml-1 pt-ml-1">
							<div className="flex items-center justify-between font-mono text-3xs text-text-muted uppercase">
								<span>Threshold Amount</span>
								<span className="text-text font-bold">${payoutInput}</span>
							</div>
							<Input
								size="sm"
								value={payoutInput}
								onChange={(e) => setPayoutInput(e.target.value)}
								autoComplete="off"
								data-1p-ignore
								data-lpignore="true"
							/>
						</div>
					</div>

					{/* Author & Maintainer Card */}
					<div className="flex flex-col gap-ml-2-5 rounded-xl border border-border bg-surface p-ml-4 shadow-xs transition-colors hover:border-border-strong">
						<div className="flex items-center gap-ml-2">
							<Avatar size="sm">CA</Avatar>
							<div className="flex flex-col truncate font-mono">
								<span className="text-xs font-bold text-text truncate">
									Chitrank Agnihotri
								</span>
								<span className="text-3xs text-text-muted truncate">
									Lead Maintainer · Monoline
								</span>
							</div>
						</div>
						<div className="flex items-center gap-ml-2 pt-ml-1">
							<Checkbox
								id="chk_tokens"
								checked={check2}
								onCheckedChange={(v) => setCheck2(!!v)}
								aria-label="Enable token caching option"
							/>
							<label
								htmlFor="chk_tokens"
								className="cursor-pointer font-mono text-3xs text-text-secondary"
							>
								Enable OKLCH Token Caching
							</label>
						</div>
					</div>
				</div>

				{/* ========================================================= */}
				{/* COLUMN 4: EDITORIAL CARD, CHAT & QUICK ACTIONS            */}
				{/* ========================================================= */}
				<div className="flex flex-col gap-ml-4">
					{/* Editorial Article Card with hover arrow */}
					<Card href="/docs/components/card" size="sm" className="shadow-xs">
						<Card.Body>
							<Card.Header>
								<div className="flex items-center justify-between">
									<Card.Eyebrow>EDITORIAL · LAYOUT</Card.Eyebrow>
									<Badge variant="accent" size="sm">
										OKLCH
									</Badge>
								</div>
								<Card.Title>Monospace Editorial System</Card.Title>
								<Card.Description lines={2}>
									47 components with zero runtime CSS bloat, razor-sharp
									strokes, and token-aware dark modes.
								</Card.Description>
							</Card.Header>

							<div className="flex flex-wrap items-center gap-ml-1 pt-ml-1">
								<Tag size="sm" asChild>
									<span>React 19</span>
								</Tag>
								<Tag size="sm" asChild>
									<span>Tailwind v4</span>
								</Tag>
							</div>
						</Card.Body>
						<Card.Footer>
							<span className="font-mono text-3xs uppercase tracking-eyebrow text-text-muted">
								Explore component
							</span>
							<Card.Arrow />
						</Card.Footer>
					</Card>

					{/* Live Terminal / Prompt Chat Widget */}
					<div className="flex flex-col justify-between gap-ml-3 rounded-xl border border-border bg-surface p-ml-4 shadow-xs transition-colors hover:border-border-strong">
						<div className="flex items-center justify-between border-b border-border pb-ml-2">
							<div className="flex items-center gap-ml-1-5 font-mono text-xs font-bold text-text">
								<span className="size-2 rounded-full bg-accent animate-pulse" />
								<span>Monoline CLI</span>
							</div>
							<span className="font-mono text-3xs text-text-muted">READY</span>
						</div>

						<div className="flex flex-col gap-ml-1-5 font-mono text-xs rounded-lg bg-surface-2/60 p-ml-2-5 border border-border/60">
							<p className="m-0 text-3xs text-text-muted">
								$ npm i @chitrank2050/monoline-ui
							</p>
							<p className="m-0 text-accent font-semibold text-3xs">
								✓ Installed 47 components (0ms CSS runtime)
							</p>
						</div>

						<div className="flex items-center gap-ml-1-5">
							<Input
								size="sm"
								placeholder="Ask CLI or generate..."
								value={chatInput}
								onChange={(e) => setChatInput(e.target.value)}
								autoComplete="off"
								data-1p-ignore
								data-lpignore="true"
							/>
							<Button size="sm" variant="secondary">
								Send
							</Button>
						</div>
					</div>

					{/* Quick Actions & Metric */}
					<Metric
						size="sm"
						value="47"
						label="Production Components"
						trend="up"
						description="Accessible WAI-ARIA primitives ready for copy-paste or package import."
					/>
				</div>
			</div>

			{/* Bottom Fade Gradient Mask Overlay (Shadcn style) */}
			<div
				className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-background via-background/80 to-transparent"
				aria-hidden="true"
			/>
		</div>
	)
}
