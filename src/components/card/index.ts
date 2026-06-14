import { CardAction } from "./action"
import { CardArrow } from "./arrow"
import { CardBody } from "./body"
import { CardDescription } from "./description"
import { CardFooter } from "./footer"
import { CardHeader } from "./header"
import { CardImage } from "./image"
import { CardMeta } from "./meta"
import { CardRoot } from "./root"
import { CardTitle } from "./title"

export * from "./types"

export const Card = Object.assign(CardRoot, {
	Action: CardAction,
	Image: CardImage,
	Body: CardBody,
	Header: CardHeader,
	Meta: CardMeta,
	Title: CardTitle,
	Description: CardDescription,
	Footer: CardFooter,
	Arrow: CardArrow,
})

export {
	CardAction,
	CardBody,
	CardDescription,
	CardFooter,
	CardHeader,
	CardImage,
	CardMeta,
	CardTitle,
}
