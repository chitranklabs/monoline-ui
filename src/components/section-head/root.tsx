import { cn } from "../../lib/utils"
import { Eyebrow } from "../eyebrow"
import type {
	SectionHeadLevel,
	SectionHeadProps,
	SectionHeadSize,
} from "./types"

const titleSizeClasses: Record<SectionHeadSize, string> = {
	sm: "text-[28px]",
	md: "text-[36px]",
	lg: "text-[44px]",
	xl: "text-[clamp(48px,9vw,96px)] leading-[0.95] tracking-[-0.04em]",
}

const headingByLevel: Record<SectionHeadLevel, "h1" | "h2" | "h3"> = {
	1: "h1",
	2: "h2",
	3: "h3",
}

export function SectionHeadRoot({
	className,
	size = "lg",
	eyebrow,
	title,
	lede,
	level = 2,
	...props
}: SectionHeadProps) {
	const Heading = headingByLevel[level]

	return (
		<header className={cn("flex flex-col gap-ml-4", className)} {...props}>
			{eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
			<Heading
				className={cn(
					"m-0 text-balance font-mono font-bold leading-[1.05] tracking-[-0.03em] text-primary",
					titleSizeClasses[size]
				)}
			>
				{title}
			</Heading>
			{lede ? (
				<p className="m-0 max-w-140 text-pretty text-base leading-[1.65] text-secondary">
					{lede}
				</p>
			) : null}
		</header>
	)
}
