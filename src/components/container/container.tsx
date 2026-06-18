import { cn } from "../../lib/utils"

export type ContainerSize = "sm" | "md" | "lg"

export interface ContainerProps extends React.ComponentProps<"div"> {
	size?: ContainerSize
	as?: React.ElementType
}

export function Container({
	size = "md",
	as: Tag = "div",
	className,
	children,
	ref,
	...props
}: ContainerProps) {
	return (
		<Tag
			ref={ref}
			data-slot="container"
			data-size={size}
			className={cn("ml-container", className)}
			{...props}
		>
			{children}
		</Tag>
	)
}

Container.displayName = "Container"
