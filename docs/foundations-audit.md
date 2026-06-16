# Foundations Audit Notes

This note records the foundation consistency pass from the Tailwind v4 and shadcn compatibility audit.

## Fixed

- Breakpoints are exposed through Tailwind `--breakpoint-*` theme variables.
- Z-index layers are exposed through `--z-index-*` theme variables.
- Monoline container widths are exposed through `max-w-container-*` and `max-w-monoline-*` utility keys.
- Blur tokens are exposed through Tailwind `--blur-*` variables.
- Semantic colors for live state and callouts are exposed through Tailwind color variables.
- Border-width tokens have explicit semantic utilities such as `border-thin`, `border-medium`, and directional variants.
- Animation utilities now consume `--animate-*` theme variables while preserving existing class names.
- Intermediate spacing values are promoted to core `--space-*` tokens before being aliased as `--ml-space-*`.
- Common text utilities now match Tailwind sizing for `text-sm`, `text-base`, and `text-lg`.

## Intentional Compatibility Boundary

Monoline keeps OKLCH color values as the primary color system. Current Tailwind v4 and modern shadcn setups support OKLCH tokens cleanly through CSS-first theme variables.

Legacy snippets that hardcode `hsl(var(--background))` expect raw HSL channel values and are not directly compatible with Monoline's `--background: oklch(...)` contract. Do not change Monoline's primary tokens to raw HSL for that compatibility path. If a legacy snippet requires HSL channels, adapt that snippet or add a dedicated legacy alias instead of weakening the foundation tokens.

## Font Variable Contract

Next/font variables must target source variables such as `--font-inter-sans`, `--font-plex-mono`, `--font-caveat-script`, or `--font-manrope-headline`.

Do not assign Next/font directly to final role variables such as `--font-sans`, `--font-mono`, `--font-script`, or `--font-headline`. Those role variables are composed in `tokens.css` so fallback stacks remain intact.
