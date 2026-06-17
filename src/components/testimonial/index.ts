import { TestimonialGrid } from "../testimonial-grid"
import { TestimonialRoot } from "./root"
import "./testimonial.css"

export * from "./types"
export { TestimonialGrid } from "../testimonial-grid"

export const Testimonial = Object.assign(TestimonialRoot, {
	displayName: "Testimonial",
	Grid: TestimonialGrid,
})
