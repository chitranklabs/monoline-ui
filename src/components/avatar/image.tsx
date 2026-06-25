import { Slot } from "@radix-ui/react-slot"

import { cn } from "../../lib/utils"
import type { AvatarImageProps } from "./types"

export function AvatarImage({
	asChild = false,
	className,
	loading = "lazy",
	decoding = "async",
	ref,
	...props
}: AvatarImageProps) {
	const Comp = asChild ? Slot : "img"
	const imageProps = asChild ? props : { loading, decoding, ...props }

	return (
		<Comp
			ref={ref}
			className={cn("size-full object-cover", className)}
			{...imageProps}
		/>
	)
}
