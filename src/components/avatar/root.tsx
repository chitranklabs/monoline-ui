import { cn } from "../../lib/utils"
import { AvatarImage } from "./image"
import type { AvatarProps } from "./types"

export function AvatarRoot({
	className,
	size = "md",
	src,
	alt = "",
	children,
	ref,
	...props
}: AvatarProps) {
	return (
		<span
			ref={ref}
			className={cn(
				"ml-avatar relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full border border-border-strong bg-linear-to-br from-(--avatar-from) to-(--avatar-to) font-mono font-medium tracking-[0.04em] text-primary",
				className
			)}
			data-size={size}
			{...props}
		>
			{src ? <AvatarImage src={src} alt={alt} /> : children}
		</span>
	)
}
