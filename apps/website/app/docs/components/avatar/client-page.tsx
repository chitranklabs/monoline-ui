"use client"

import { Avatar, type AvatarSize } from "@chitrank2050/monoline-ui/avatar"

import { ComponentPlayground } from "../../../_components/component-playground"

const avatarSizes: AvatarSize[] = ["xs", "sm", "md", "lg", "xl", "2xl"]

const usageCode = `<Avatar size="md" src="/avatar.jpg" alt="Chitrank Agnihotri" />

<Avatar size="lg">
  <Avatar.Image asChild>
    <Image
      src="/avatar.jpg"
      alt="Chitrank Agnihotri"
      fill
      sizes="56px"
    />
  </Avatar.Image>
</Avatar>

<Avatar size="lg">CA</Avatar>`

const sourceSnippet = `import { Avatar } from "@chitrank2050/monoline-ui/avatar"
import Image from "next/image"

export function People() {
  return (
    <div className="flex items-center gap-3">
      <Avatar size="lg">
        <Avatar.Image asChild>
          <Image
            src="/avatar.jpg"
            alt="Chitrank Agnihotri"
            fill
            sizes="56px"
          />
        </Avatar.Image>
      </Avatar>
      <Avatar size="sm">CA</Avatar>
      <Avatar size="md">SC</Avatar>
      <Avatar size="lg">RM</Avatar>
    </div>
  )
}`

const propsRows = [
	["size", "inherit | xs | sm | md | lg | xl | 2xl", "Avatar scale"],
	["src", "string?", "Optional image URL"],
	["alt", "string?", "Image alt text when src is provided"],
	[
		"Avatar.Image",
		"compound slot",
		"Use asChild for next/image or another image primitive",
	],
	["children", "ReactNode", "Fallback initials or custom content"],
] as const

const tokenRows = [
	["--avatar-from", "Fallback gradient start"],
	["--avatar-to", "Fallback gradient end"],
	["--border-strong", "Avatar outline colour"],
] as const

export default function AvatarPageClient() {
	return (
		<ComponentPlayground<AvatarSize>
			title="Avatar"
			description="Render identity images or initials with fixed size tokens, fallback color, and slotted image support."
			sizes={avatarSizes}
			defaultSize="md"
			importStatement='import { Avatar } from "@chitrank2050/monoline-ui/avatar"'
			usageCode={usageCode}
			props={propsRows}
			tokens={tokenRows}
			sourceSnippet={sourceSnippet}
			renderPreview={(size = "md") => (
				<div className="flex flex-wrap items-center gap-ml-4 p-ml-6">
					<Avatar size={size}>CA</Avatar>
					<Avatar size={size}>SC</Avatar>
					<Avatar size={size}>RM</Avatar>
				</div>
			)}
		/>
	)
}
