import type * as React from "react"

import { cn } from "../../lib/utils"
import { Badge } from "../badge"
import type { EditorialLineProps } from "./types"

export function EditorialLineRoot({
	className,
	n,
	date,
	title,
	readTime,
	tag,
	href,
	hover = true,
	ref,
	...props
}: EditorialLineProps) {
	const sharedClassName = cn(
		"ml-editorial-line grid items-center border-b border-(--border) no-underline",
		"grid-cols-[40px_110px_1fr_auto] sm:gap-6 sm:py-5",
		tag && "md:grid-cols-[40px_110px_1fr_auto_auto]",
		"max-sm:grid-cols-[28px_1fr_auto] max-sm:gap-3 max-sm:py-4",
		hover &&
			"cursor-pointer transition-colors duration-(--duration-micro) hover:bg-(--surface-2)",
		className
	)

	const content = (
		<>
			<span className="font-mono text-sm text-(--text-muted)">
				{String(n).padStart(2, "0")}
			</span>
			<time className="font-mono text-[11px] uppercase tracking-[0.1em] text-(--text-muted) max-sm:hidden">
				{date}
			</time>
			<span className="flex min-w-0 flex-col">
				<span className="text-base font-medium leading-[1.3] tracking-[-0.01em] text-(--text-primary) sm:text-[17px]">
					{title}
				</span>
				<span className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-(--text-muted) sm:hidden">
					{date}
					{tag && <> · {tag}</>}
				</span>
			</span>
			{tag && (
				<span className="max-md:hidden">
					<Badge size="xs">{tag}</Badge>
				</span>
			)}
			<span className="whitespace-nowrap font-mono text-[11px] text-(--text-muted)">
				{readTime ? `${readTime}m →` : "→"}
			</span>
		</>
	)

	if (href) {
		return (
			<a
				ref={ref as React.Ref<HTMLAnchorElement>}
				href={href}
				className={sharedClassName}
				{...(props as React.ComponentProps<"a">)}
			>
				{content}
			</a>
		)
	}

	return (
		<article ref={ref} className={sharedClassName} {...props}>
			{content}
		</article>
	)
}
