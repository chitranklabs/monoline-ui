import { CardArrow } from "./arrow"
import { CardBody } from "./body"
import { CardFooter } from "./footer"
import { CardImage } from "./image"
import { CardRoot } from "./root"

export * from "./types"

export const Card = Object.assign(CardRoot, {
	Image: CardImage,
	Body: CardBody,
	Footer: CardFooter,
	Arrow: CardArrow,
})

export { CardBody, CardFooter, CardImage }
