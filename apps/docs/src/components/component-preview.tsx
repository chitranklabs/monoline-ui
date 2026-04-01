"use client"

import { cn } from "@chitrank2050/monoline-ui"
import { Check, Code, Copy, Eye } from "lucide-react"
import { useCallback, useState } from "react"

export function ComponentPreview({
	code,
	children,
	className,
}: {
	code: string
	children: React.ReactNode
	className?: string
}) {
	const [view, setView] = useState<"preview" | "code">("preview")
	const [copied, setCopied] = useState(false)

	const handleCopy = useCallback(async () => {
		await navigator.clipboard.writeText(code)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}, [code])

	return (
		<div
			className={cn(
				"overflow-hidden rounded-lg border border-border",
				className
			)}
		>
			<div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-1.5">
				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={() => setView("preview")}
						className={cn(
							"inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
							view === "preview"
								? "bg-background text-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground"
						)}
					>
						<Eye className="size-3" />
						Preview
					</button>
					<button
						type="button"
						onClick={() => setView("code")}
						className={cn(
							"inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
							view === "code"
								? "bg-background text-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground"
						)}
					>
						<Code className="size-3" />
						Code
					</button>
				</div>

				<button
					type="button"
					onClick={handleCopy}
					className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
					aria-label="Copy code"
				>
					{copied ? (
						<>
							<Check className="size-3" />
							Copied
						</>
					) : (
						<>
							<Copy className="size-3" />
							Copy
						</>
					)}
				</button>
			</div>

			{view === "preview" ? (
				<div className="flex min-h-[200px] items-center justify-center p-8">
					{children}
				</div>
			) : (
				<div className="relative max-h-[400px] overflow-auto bg-zinc-950">
					<pre className="p-4 font-mono text-[13px] leading-relaxed text-zinc-300">
						<code>{code}</code>
					</pre>
				</div>
			)}
		</div>
	)
}
