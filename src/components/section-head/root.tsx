import { cn } from "../../lib/utils"
import { Eyebrow } from "../eyebrow"
import type {
	SectionHeadLevel,
	SectionHeadProps,
	SectionHeadSize,
} from "./types"

const TITLE_SIZE_CLASSES_MAP: Record<SectionHeadSize, string> = {
	sm: "text-3xl",
	md: "text-4xl",
	lg: "text-5xl",
	xl: "text-6xl md:text-7xl leading-[0.95] tracking-[-0.04em]",
}

const SUB_TITLE_SIZE_CLASSES_MAP: Record<SectionHeadSize, string> = {
	sm: "text-xl",
	md: "text-2xl",
	lg: "text-3xl",
	xl: "text-4xl md:text-5xl",
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
	...props
}: SectionHeadProps) {
	const Heading = headingByLevel[level]

	return (
		<header className={cn("flex flex-col gap-ml-4", className)} {...props}>
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
		</header>
	)
}
