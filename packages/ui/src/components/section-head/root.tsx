import { cn } from "../../lib/utils"
import { Eyebrow } from "../eyebrow"
import type {
	SectionHeadLevel,
	SectionHeadProps,
	SectionHeadSize,
} from "./types"

const TITLE_SIZE_CLASSES_MAP: Record<SectionHeadSize, string> = {
	sm: "text-3xl",
	md: "text-[clamp(2.125rem,1.7rem+1vw,2.75rem)]",
	lg: "text-[clamp(2.75rem,2rem+2vw,3.75rem)]",
	xl: "text-[clamp(3.5rem,2.1rem+4vw,5.5rem)] leading-[0.95] tracking-[-0.04em]",
}

const SUB_TITLE_SIZE_CLASSES_MAP: Record<SectionHeadSize, string> = {
	sm: "text-xl",
	md: "text-[clamp(1.375rem,1.2rem+0.6vw,1.75rem)]",
	lg: "text-[clamp(1.625rem,1.35rem+0.9vw,2.125rem)]",
	xl: "text-[clamp(2rem,1.5rem+1.8vw,3rem)]",
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
	subtitle,
	lede,
	level = 2,
	as = "div",
	ref,
	...props
}: SectionHeadProps): React.ReactElement {
	const Heading = headingByLevel[level]
	const Comp = as

	return (
		<Comp
			ref={ref}
			className={cn("flex flex-col gap-ml-4", className)}
			{...props}
		>
			{eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
			<Heading
				className={cn(
					"m-0 text-balance font-mono font-bold leading-[1.05] tracking-[-0.03em] text-primary",
					TITLE_SIZE_CLASSES_MAP[size]
				)}
			>
				{title}
				{subtitle ? (
					<span
						className={cn(
							"block font-normal text-text-secondary mt-ml-2",
							SUB_TITLE_SIZE_CLASSES_MAP[size]
						)}
					>
						{subtitle}
					</span>
				) : null}
			</Heading>
			{lede ? (
				<p className="m-0 max-w-140 text-pretty text-base leading-[1.65] text-body">
					{lede}
				</p>
			) : null}
		</Comp>
	)
}
