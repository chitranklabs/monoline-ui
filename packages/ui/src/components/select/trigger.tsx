"use client"

import { cn, composeRefs } from "../../lib/utils"
import { Dialog } from "../dialog"
import { Popover } from "../popover"
import { useSelectContext } from "./root"
import type { SelectTriggerProps } from "./types"

export function SelectTrigger({
	className,
	children,
	onClick,
	onKeyDown,
	ref,
	type,
	...props
}: SelectTriggerProps): React.ReactElement {
	const {
		isMobile,
		label,
		listboxId,
		open,
		selectedOption,
		setOpen,
		placeholder,
		triggerRef,
	} = useSelectContext()

	const trigger = (
		<button
			ref={composeRefs(triggerRef, ref)}
			type={type ?? "button"}
			aria-expanded={open}
			aria-haspopup="listbox"
			aria-controls={listboxId}
			className={cn(
				"ml-select__trigger inline-flex max-w-full select-none items-center justify-between whitespace-nowrap rounded-md border font-medium focus-visible:outline-none",
				className
			)}
			onClick={(event) => {
				onClick?.(event)
				if (event.defaultPrevented) return
				if (!isMobile) setOpen(!open)
			}}
			onKeyDown={(e) => {
				onKeyDown?.(e)
				if (e.defaultPrevented) return
				if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
					e.preventDefault()
					setOpen(true)
				}
			}}
			{...props}
		>
			<span className="ml-select__trigger-copy">
				{children ?? (
					<>
						{label ? (
							<span className="ml-select__label font-normal">{label}:</span>
						) : null}
						<span className="truncate font-medium text-primary">
							{selectedOption?.label ?? placeholder}
						</span>
					</>
				)}
			</span>
			<span aria-hidden="true" className="ml-select__caret" data-open={open}>
				<ChevronDownIcon />
			</span>
		</button>
	)

	return isMobile ? (
		<Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
	) : (
		<Popover.Anchor asChild>{trigger}</Popover.Anchor>
	)
}

function ChevronDownIcon() {
	return (
		<svg
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="size-full"
		>
			<path
				d="M4 6.5L8 10L12 6.5"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
