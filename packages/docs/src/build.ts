import { buildAstroDocs } from "./astro-engine.ts"
import type { MonolineDocsConfig } from "./config.ts"

export type BuildOptions = MonolineDocsConfig

/** Build a local, static Markdown or MDX site. Paths are relative to the caller's cwd. */
export const buildDocs = buildAstroDocs
