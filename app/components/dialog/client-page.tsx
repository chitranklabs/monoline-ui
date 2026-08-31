"use client"

import { Button } from "@chitrank2050/monoline-ui/button"
import { Dialog } from "@chitrank2050/monoline-ui/dialog"

import { ComponentPlayground } from "../../_components/component-playground"

const usageCode = `<Dialog>
  <Dialog.Trigger asChild>
    <Button>Edit profile</Button>
  </Dialog.Trigger>
  <Dialog.Content>
	<p className="ml-eyebrow">Profile · Public details</p>
    <Dialog.Title>Edit profile</Dialog.Title>
    <Dialog.Description>Update the details shown on your profile.</Dialog.Description>
    <Dialog.Close asChild>
      <Button variant="secondary">Done</Button>
    </Dialog.Close>
  </Dialog.Content>
</Dialog>`

export default function DialogPageClient() {
	return (
		<ComponentPlayground
			title="Dialog"
			description="Open a modal surface with focus containment, Escape and outside dismissal, labelled content, and automatic focus restoration."
			importStatement='import { Dialog } from "@chitrank2050/monoline-ui/dialog"'
			usageCode={usageCode}
			sourceSnippet={usageCode}
			props={[
				["open", "boolean", "Controlled open state"],
				["defaultOpen", "boolean", "Initial uncontrolled state"],
				["onOpenChange", "(open) => void", "Runs whenever open state changes"],
				["Dialog.Trigger", "compound slot", "Control that opens the dialog"],
				["Dialog.Content", "compound slot", "Portal-mounted modal surface"],
				["Dialog.Title", "compound slot", "Required accessible dialog name"],
				[
					"Dialog.Description",
					"compound slot",
					"Optional supporting description",
				],
				["Dialog.Close", "compound slot", "Control that closes the dialog"],
			]}
			tokens={[
				["--popover", "Dialog surface"],
				["--background", "Modal backdrop blend"],
				["--shadow-xl", "Floating elevation"],
				["--z-modal", "Overlay order"],
			]}
			renderPreview={(_size, _theme, _variant, portalContainer) => (
				<div className="flex min-h-72 items-center justify-center p-ml-6">
					<Dialog>
						<Dialog.Trigger asChild>
							<Button>Edit profile</Button>
						</Dialog.Trigger>
						<Dialog.Content container={portalContainer}>
							<p className="ml-eyebrow">Profile · Public details</p>
							<Dialog.Title>Edit profile</Dialog.Title>
							<Dialog.Description>
								Update the details shown on your public profile.
							</Dialog.Description>
							<div className="mt-ml-6 flex items-center justify-between gap-ml-4 border-t border-(--border) pt-ml-4">
								<span className="text-xs text-text-muted">
									Changes apply immediately.
								</span>
								<Dialog.Close asChild>
									<Button variant="secondary">Done</Button>
								</Dialog.Close>
							</div>
						</Dialog.Content>
					</Dialog>
				</div>
			)}
		/>
	)
}
