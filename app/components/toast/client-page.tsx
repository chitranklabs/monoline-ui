"use client"

import { Toast, type ToastVariant } from "@chitrank2050/monoline-ui/toast"

import { ComponentPlayground } from "../../_components/component-playground"

const toastVariants: ToastVariant[] = ["accent", "success", "warn"]

const usageCode = `<Toast variant="accent">Document uploaded successfully.</Toast>
<Toast variant="success">Changes saved.</Toast>
<Toast variant="warn">Connection lost. Reconnecting...</Toast>`

const sourceSnippet = `import { Toast } from "@chitrank2050/monoline-ui/toast"

export function StatusToast() {
  return (
    <Toast variant="success" onDismiss={() => console.log('dismiss')}>
      Feature activated!
    </Toast>
  )
}`

const propsRows = [
	["variant", "accent | success | warn", "Visual state and color dot"],
	["onDismiss", "() => void", "Callback showing a dismiss '✕' action button"],
] as const

const tokenRows = [["--accent", "Accent status color indicator"]] as const

export default function ToastPageClient() {
	return (
		<ComponentPlayground<ToastVariant>
			title="Toast"
			description="Action feedback banners notifying the user of asynchronous updates or status changes."
			sizes={toastVariants}
			defaultSize="accent"
			importStatement='import { Toast } from "@chitrank2050/monoline-ui/toast"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(variant = "accent") => (
				<div className="grid gap-ml-5 p-ml-6 w-full max-w-sm">
					<Toast variant={variant} onDismiss={() => {}}>
						Feedback notification message displaying the status of {variant}.
					</Toast>
				</div>
			)}
		/>
	)
}
