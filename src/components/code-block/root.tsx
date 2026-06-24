"use client"

import { useState } from "react"

import { cn } from "../../lib/utils"
import type { CodeBlockProps } from "./types"

export function CodeBlockRoot({
	filename,
	code,
	language,
	children,
	className,
	ref,
	...props
}: CodeBlockProps) {
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
				"ml-code-block relative group overflow-hidden rounded-md border",
				className
			)}
			{...props}
		>
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
							"absolute top-3 right-3 z-10 cursor-pointer rounded border border-border bg-card px-2 py-1 font-mono text-[10px] text-text-muted opacity-0 transition-all duration-(--duration-fast) hover:border-border-strong hover:text-text group-hover:opacity-100",
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
					className="ml-code-block__pre m-0 overflow-auto p-4 font-mono text-[12.5px] leading-[1.7]"
					data-language={language}
				>
					<code>{code}</code>
				</pre>
			)}
		</figure>
	)
}
