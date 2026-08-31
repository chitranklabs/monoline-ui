"use client"

import { useState } from "react"

import { cn } from "../../lib/utils"
import type { CodeBlockProps } from "./types"

export function CodeBlockRoot({
	filename,
	description,
	code,
	language,
	children,
	className,
	ref,
	...props
}: CodeBlockProps): React.ReactElement {
	const [copied, setCopied] = useState(false)

	function copy() {
		if (!code) return
		navigator.clipboard?.writeText(code)
		setCopied(true)
		setTimeout(() => setCopied(false), 1400)
	}

	return (
		<figure
			ref={ref}
			className={cn(
				"ml-code-block relative group overflow-hidden rounded-xl border border-border bg-surface",
				className
			)}
			{...props}
		>
			{description && (
				<div className="ml-code-block__description border-b border-border bg-surface-2/40 px-4 py-3">
					{typeof description === "string" ? (
						<p className="m-0 text-xs text-text-secondary leading-relaxed font-medium">
							{description}
						</p>
					) : (
						description
					)}
				</div>
			)}
			{filename ? (
				<header className="ml-code-block__header flex items-center justify-between border-b px-4 py-2">
					<span className="font-mono text-[11px] text-text-muted">
						{filename}
					</span>
					{code && (
						<button
							type="button"
							onClick={copy}
							className="cursor-pointer border-none bg-transparent font-mono text-[10px] text-text-muted transition-colors duration-(--duration-micro) hover:text-text"
						>
							{copied ? "✓ Copied" : "Copy"}
						</button>
					)}
				</header>
			) : (
				code && (
					<button
						type="button"
						onClick={copy}
						className={cn(
							"absolute top-3 right-3 z-10 cursor-pointer rounded border border-border bg-card px-2 py-1 font-mono text-[10px] text-text-muted opacity-0 transition-[border-color,box-shadow,color,opacity] duration-(--duration-fast) hover:border-border-strong hover:text-text focus-visible:opacity-100 focus-visible:outline-none focus-visible:shadow-(--focus-ring) group-hover:opacity-100",
							copied &&
								"opacity-100 border-accent/30 text-accent hover:text-accent"
						)}
					>
						{copied ? "✓ Copied" : "Copy"}
					</button>
				)
			)}
			{children ?? (
				<pre
					// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
					tabIndex={0}
					className="ml-code-block__pre m-0 overflow-auto p-4 font-mono text-[12.5px] leading-[1.7]"
					data-language={language}
				>
					<code>{code}</code>
				</pre>
			)}
		</figure>
	)
}
