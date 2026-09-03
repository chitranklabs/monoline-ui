/** @module Class-name composition utilities used by Monoline UI components. */
import type * as React from "react"

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs))
}

export function composeRefs<T>(
	...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
	return (node) => {
		for (const ref of refs) {
			if (!ref) continue
			if (typeof ref === "function") {
				ref(node)
			} else {
				ref.current = node
			}
		}
	}
}
