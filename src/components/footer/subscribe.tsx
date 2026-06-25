import { cn } from "../../lib/utils"
import type { FooterSubscribeFormProps } from "./types"

export function FooterSubscribeForm({
	description = "One essay a month. No tracking, no nonsense.",
	placeholder = "you@studio.com",
	inputName = "email",
	submitLabel = "Subscribe",
	action = "#",
	method = "post",
	className,
	ref,
	...props
}: FooterSubscribeFormProps): React.ReactElement {
	return (
		<form
			ref={ref}
			action={action}
			method={method}
			className={cn("flex min-w-0 flex-col gap-ml-3", className)}
			{...props}
		>
			<p className="max-w-(--ml-footer-subscribe-copy-max) text-base leading-relaxed text-body">
				{description}
			</p>
			<div className="flex h-(--ml-footer-subscribe-control-height) w-full max-w-(--ml-footer-subscribe-control-max) overflow-hidden rounded-md border border-border-strong bg-card p-ml-1 transition-[border-color,box-shadow] duration-(--duration-micro) ease-out focus-within:border-accent focus-within:shadow-(--focus-ring)">
				<input
					type="email"
					name={inputName}
					required
					autoComplete="email"
					placeholder={placeholder}
					aria-label="Email address"
					className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent px-ml-3 text-sm text-primary outline-none transition-colors duration-(--duration-micro) ease-out focus:placeholder:text-muted-foreground/70"
				/>
				<button
					type="submit"
					aria-label={submitLabel}
					className="group/submit inline-flex aspect-square h-full items-center justify-center rounded-sm bg-accent text-accent-foreground transition-[background-color,box-shadow,opacity] duration-(--duration-micro) ease-out active:opacity-90 focus-visible:outline-none focus-visible:shadow-(--focus-ring)"
				>
					<span
						aria-hidden="true"
						className="transition-opacity duration-(--duration-micro) ease-out group-hover/submit:opacity-80"
					>
						→
					</span>
				</button>
			</div>
		</form>
	)
}
