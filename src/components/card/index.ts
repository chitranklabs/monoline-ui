import { CardAction } from "./action"
import { CardArrow } from "./arrow"
import { CardBody } from "./body"
import { CardDescription } from "./description"
import { CardEyebrow } from "./eyebrow"
import { CardFooter } from "./footer"
import { CardHeader } from "./header"
import { CardImage } from "./image"
import { CardImageCaption } from "./image-caption"
import { CardMeta } from "./meta"
import { CardRoot } from "./root"
import { CardTagList } from "./tag-list"
import { CardTitle } from "./title"

export * from "./types"

export const Card = Object.assign(CardRoot, {
	displayName: "Card",
	Action: CardAction,
	Image: CardImage,
	ImageCaption: CardImageCaption,
	Body: CardBody,
	Header: CardHeader,
	Meta: CardMeta,
	Title: CardTitle,
	Eyebrow: CardEyebrow,
	Description: CardDescription,
	Footer: CardFooter,
	TagList: CardTagList,
	Arrow: CardArrow,
})

export {
	CardAction,
	CardBody,
	CardDescription,
	CardEyebrow,
	CardFooter,
	CardHeader,
	CardImage,
	CardImageCaption,
	CardMeta,
	CardTagList,
	CardTitle,
}
