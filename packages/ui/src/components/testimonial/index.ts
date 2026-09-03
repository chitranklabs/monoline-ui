/**
 * @module Testimonial
 * Description for Testimonial component.
 */
import { TestimonialGrid } from "../testimonial-grid"
import { TestimonialRoot } from "./root"

export * from "./types"
export { TestimonialGrid } from "../testimonial-grid"

export const Testimonial: typeof TestimonialRoot & {
	displayName: string
	Grid: typeof TestimonialGrid
} = Object.assign(TestimonialRoot, {
	displayName: "Testimonial",
	Grid: TestimonialGrid,
})
