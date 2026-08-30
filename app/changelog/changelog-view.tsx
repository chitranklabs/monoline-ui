"use client"

import {
	useCallback,
	useDeferredValue,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Badge } from "@chitrank2050/monoline-ui/badge"
import { Button } from "@chitrank2050/monoline-ui/button"
import {
	ChangelogTimeline,
	type GitCliffRelease,
} from "@chitrank2050/monoline-ui/changelog"
import { Input } from "@chitrank2050/monoline-ui/input"
import { Tag } from "@chitrank2050/monoline-ui/tag"

import { ChangelogToc } from "./toc"

// Hoisted regular expressions to eliminate per-render regex compilation
const HTML_COMMENT_REGEX = /<!--.*?-->/g
const LEADING_NON_WORD_REGEX = /^[^\w]+/

function cleanGroupName(rawGroup?: string | null): string {
	if (!rawGroup) return "Miscellaneous Tasks"
	const cleaned = rawGroup
		.replace(HTML_COMMENT_REGEX, "")
		.replace(LEADING_NON_WORD_REGEX, "")
		.trim()
	return cleaned || rawGroup
}

// Minimal inline SVG icons for monochrome editorial aesthetics
function IconRss({ className = "size-3.5" }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M4 11a9 9 0 0 1 9 9" />
			<path d="M4 4a16 16 0 0 1 16 16" />
			<circle cx="5" cy="19" r="1" fill="currentColor" />
		</svg>
	)
}

function IconCheck({ className = "size-3.5" }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline points="20 6 9 17 4 12" />
		</svg>
	)
}

function IconSearch({ className = "size-3" }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.3-4.3" />
		</svg>
	)
}

function IconGlobe({ className = "size-3" }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
			<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
			<path d="M2 12h20" />
		</svg>
	)
}

function IconSparkle({ className = "size-3" }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
		</svg>
	)
}

function IconBug({ className = "size-3" }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect width="8" height="14" x="8" y="6" rx="4" />
			<path d="m19 7-3 2" />
			<path d="m5 7 3 2" />
			<path d="m19 19-3-2" />
			<path d="m5 19 3-2" />
			<path d="M20 13h-4" />
			<path d="M4 13h4" />
			<path d="m10 4 1 2" />
			<path d="m14 4-1 2" />
		</svg>
	)
}

function IconZap({ className = "size-3" }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
		</svg>
	)
}

function IconDocs({ className = "size-3" }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
			<path d="M6 6h10" />
			<path d="M6 10h10" />
		</svg>
	)
}

function IconWrench({ className = "size-3" }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="3" />
			<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
		</svg>
	)
}

function IconAlert({ className = "size-3" }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
			<line x1="12" y1="9" x2="12" y2="13" />
			<line x1="12" y1="17" x2="12.01" y2="17" />
		</svg>
	)
}

const PRESET_GROUPS = [
	{ id: "all", label: "All", icon: IconGlobe },
	{ id: "Features", label: "Features", icon: IconSparkle },
	{ id: "Bug Fixes", label: "Fixes", icon: IconBug },
	{ id: "Performance", label: "Performance", icon: IconZap },
	{ id: "Documentation", label: "Docs", icon: IconDocs },
	{ id: "Maintenance", label: "Maintenance", icon: IconWrench },
	{ id: "breaking", label: "Breaking", icon: IconAlert },
] as const

interface ChangelogViewProps {
	initialReleases: GitCliffRelease[]
	feedUrl: string
}

export function ChangelogView({
	initialReleases,
	feedUrl,
}: ChangelogViewProps) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const paramCategory = searchParams.get("category")
	const paramQuery = searchParams.get("q") ?? searchParams.get("search") ?? ""

	const matchedPreset = PRESET_GROUPS.find(
		(p) => p.id.toLowerCase() === (paramCategory || "").toLowerCase()
	)

	const [activeGroup, setActiveGroup] = useState<string>(
		matchedPreset ? matchedPreset.id : "all"
	)
	const [searchQuery, setSearchQuery] = useState<string>(paramQuery)
	const [copiedRss, setCopiedRss] = useState(false)

	// Defer search query during heavy re-filtering to keep typing at 60fps
	const deferredQuery = useDeferredValue(searchQuery)

	// Ref-based debounce timer for URL query param sync to avoid unnecessary mount effects
	const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	// Keep URL query params synchronized for SEO, bookmarking, and deep links
	const updateQueryParams = useCallback(
		(group: string, query: string) => {
			const params = new URLSearchParams()
			if (group !== "all") {
				params.set("category", group.toLowerCase())
			}
			if (query.trim()) {
				params.set("q", query.trim())
			}
			const qs = params.toString()
			const url = qs ? `${pathname}?${qs}` : pathname
			if (typeof window !== "undefined") {
				window.history.replaceState(null, "", url)
			}
			router.replace(url, { scroll: false })
		},
		[pathname, router]
	)

	const handleGroupChange = (newGroup: string) => {
		setActiveGroup(newGroup)
		updateQueryParams(newGroup, searchQuery)
	}

	const handleSearchChange = (newQuery: string) => {
		setSearchQuery(newQuery)
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current)
		}
		if (!newQuery.trim()) {
			updateQueryParams(activeGroup, "")
		} else {
			debounceTimerRef.current = setTimeout(() => {
				updateQueryParams(activeGroup, newQuery)
			}, 250)
		}
	}

	// Clean up debounce timer on unmount
	useEffect(() => {
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current)
			}
		}
	}, [])

	const handleCopyRss = async () => {
		try {
			await navigator.clipboard.writeText(feedUrl)
			setCopiedRss(true)
			setTimeout(() => setCopiedRss(false), 2000)
		} catch {
			// fallback
		}
	}

	// Filter releases and commits using deferredQuery for optimal responsiveness
	const filteredReleases = useMemo(() => {
		const query = deferredQuery.trim().toLowerCase()

		return initialReleases
			.map((release) => {
				const matchingCommits = release.commits.filter((commit) => {
					// 1. Group filter
					if (activeGroup === "breaking") {
						if (!commit.breaking) return false
					} else if (activeGroup !== "all") {
						const clean = cleanGroupName(commit.group)
						if (
							clean.toLowerCase() !== activeGroup.toLowerCase() &&
							!commit.group?.toLowerCase().includes(activeGroup.toLowerCase())
						) {
							return false
						}
					}

					// 2. Search query filter
					if (query) {
						const matchesMessage = commit.message.toLowerCase().includes(query)
						const matchesScope =
							commit.scope?.toLowerCase().includes(query) ?? false
						const matchesSha = commit.id.toLowerCase().includes(query)
						const matchesAuthor =
							commit.author.name.toLowerCase().includes(query) ||
							(commit.remote?.username?.toLowerCase().includes(query) ?? false)

						if (
							!matchesMessage &&
							!matchesScope &&
							!matchesSha &&
							!matchesAuthor
						) {
							return false
						}
					}

					return true
				})

				return {
					...release,
					commits: matchingCommits,
				}
			})
			.filter((release) => release.commits.length > 0)
	}, [initialReleases, activeGroup, deferredQuery])

	// Dynamic TOC items based on filtered releases
	const tocItems = useMemo(() => {
		return filteredReleases.map((release) => {
			const version = release.version ?? "Unreleased"
			return {
				id: `release-${version.replace(/\./g, "-")}`,
				label: version,
			}
		})
	}, [filteredReleases])

	// Dynamic commit counts per group for Tag suffixes
	const groupCounts = useMemo(() => {
		const counts: Record<string, number> = { all: 0 }
		for (const release of initialReleases) {
			for (const commit of release.commits) {
				counts.all = (counts.all || 0) + 1
				if (commit.breaking) {
					counts.breaking = (counts.breaking || 0) + 1
				}
				const clean = cleanGroupName(commit.group)
				const matchedPreset = PRESET_GROUPS.find(
					(p) =>
						p.id !== "all" &&
						p.id !== "breaking" &&
						(clean.toLowerCase() === p.id.toLowerCase() ||
							commit.group?.toLowerCase().includes(p.id.toLowerCase()))
				)
				if (matchedPreset) {
					counts[matchedPreset.id] = (counts[matchedPreset.id] || 0) + 1
				}
			}
		}
		return counts
	}, [initialReleases])

	const resetFilters = () => {
		setActiveGroup("all")
		setSearchQuery("")
		updateQueryParams("all", "")
	}

	return (
		<div className="space-y-ml-8">
			{/* Top Utility Row */}
			<div className="flex flex-wrap items-center justify-between gap-ml-4 border-b border-border pb-ml-4 text-xs font-mono">
				<div className="flex items-center gap-ml-3">
					<Button
						variant="ghost"
						size="sm"
						onClick={handleCopyRss}
						className="h-ml-7 gap-1.5 px-2 text-xs font-mono text-text-muted hover:text-text"
					>
						{copiedRss ? <IconCheck /> : <IconRss />}
						<span>{copiedRss ? "Copied Feed URL!" : "Copy RSS Feed URL"}</span>
					</Button>
				</div>

				<div className="flex items-center gap-ml-2">
					<Badge variant="outline" size="sm">
						{filteredReleases.length} release
						{filteredReleases.length !== 1 ? "s" : ""}
					</Badge>
				</div>
			</div>

			{/* Filter Bar: Category Tags + Live Search Input */}
			<div className="flex flex-col gap-ml-3 sm:flex-row sm:items-center sm:justify-between">
				{/* Category Tag Pills using Monoline Tag component */}
				<div className="flex flex-wrap items-center gap-1.5">
					{PRESET_GROUPS.map((preset) => {
						const isActive = activeGroup === preset.id
						const Icon = preset.icon
						const count = groupCounts[preset.id]
						return (
							<Tag
								key={preset.id}
								size="sm"
								selected={isActive}
								prefix={<Icon className="size-3" />}
								suffix={count ? String(count) : undefined}
								onClick={() =>
									handleGroupChange(
										isActive && preset.id !== "all" ? "all" : preset.id
									)
								}
								onDismiss={
									isActive && preset.id !== "all"
										? () => handleGroupChange("all")
										: undefined
								}
								dismissAriaLabel={`Remove ${preset.label} filter`}
								className="font-mono text-3xs uppercase tracking-wider transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]"
							>
								{preset.label}
							</Tag>
						)
					})}
				</div>

				{/* Search Input using Monoline Input component */}
				<div className="w-full sm:w-64">
					<Input
						size="sm"
						value={searchQuery}
						onChange={(e) => handleSearchChange(e.target.value)}
						placeholder="Find in changelog..."
						prefix={<IconSearch />}
						suffix={
							searchQuery ? (
								<button
									type="button"
									onClick={() => handleSearchChange("")}
									className="text-text-muted hover:text-text cursor-pointer text-2xs"
									aria-label="Clear search"
								>
									✕
								</button>
							) : undefined
						}
					/>
				</div>
			</div>

			{/* Two-column layout: sticky TOC left, timeline right */}
			<div className="changelog-layout pt-ml-2">
				{/* Sticky TOC sidebar */}
				<aside className="changelog-layout__toc">
					<div className="changelog-layout__toc-inner">
						{tocItems.length > 0 ? (
							<ChangelogToc items={tocItems} />
						) : (
							<p className="text-2xs font-mono text-text-muted p-2">
								No matches
							</p>
						)}
					</div>
				</aside>

				{/* Main timeline */}
				<section className="changelog-layout__content">
					<h2 className="sr-only">Release history</h2>
					{filteredReleases.length > 0 ? (
						<ChangelogTimeline
							releases={filteredReleases}
							githubOwner="chitranklabs"
							githubRepo="monoline-ui"
							allowedGroups={[
								"Features",
								"Bug Fixes",
								"Performance",
								"Documentation",
								"Maintenance",
								"Miscellaneous Tasks",
							]}
						/>
					) : (
						<div className="rounded-xl border border-dashed border-border p-ml-12 text-center">
							<p className="text-sm font-mono text-text-muted">
								No changelog entries found matching your active filters.
							</p>
							<Button
								variant="secondary"
								size="sm"
								onClick={resetFilters}
								className="mt-ml-4 text-xs font-mono"
							>
								Clear filters
							</Button>
						</div>
					)}
				</section>
			</div>
		</div>
	)
}
