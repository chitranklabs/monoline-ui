import { cn } from "../../lib/utils"
import type { AvatarProps, AvatarSize } from "./types"

const avatarSizeClasses: Record<AvatarSize, string> = {
	sm: "size-ml-7 text-xs",
	md: "size-ml-9 text-xs",
	lg: "size-ml-14 text-sm",
	xl: "size-ml-20 text-xl",
}

export function AvatarRoot({
	className,
	size = "md",
	src,
	alt = "",
	children,
	...props
}: AvatarProps) {
	return (
		<span
			className={cn(
				"inline-grid shrink-0 place-items-center overflow-hidden rounded-full border border-border-strong bg-linear-to-br from-(--avatar-from) to-(--avatar-to) font-mono font-medium tracking-[0.04em] text-primary",
				avatarSizeClasses[size],
				className
			)}
			{...props}
		>
			{src ? (
				<img
					src={src}
					alt={alt}
					className="size-full object-cover"
					loading="lazy"
				/>
			) : (
				children
			)}
		</span>
	)
}
