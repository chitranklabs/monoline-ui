import * as esbuild from "esbuild"
import assert from "node:assert/strict"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { createRequire } from "node:module"
import os from "node:os"
import path from "node:path"
import { pathToFileURL } from "node:url"

const require = createRequire(import.meta.url)
const projectRoot = path.resolve(import.meta.dirname, "..")
const react18Root = path.dirname(require.resolve("react18/package.json"))
const reactDom18Root = path.dirname(require.resolve("react-dom18/package.json"))

const result = await esbuild.build({
	stdin: {
		resolveDir: projectRoot,
		loader: "tsx",
		contents: `
import React from "react"
import { renderToString } from "react-dom/server"
import { ProfileHero } from "./registry/default/profile-hero-01/profile-hero-01"
import { ProjectIndex } from "./registry/default/project-index-01/project-index-01"

if (!React.version.startsWith("18.")) throw new Error(\`Expected React 18, received \${React.version}\`)

const html = renderToString(
  <main>
    <ProfileHero
      name="Ada Lovelace"
      jobTitle="Software engineer"
      location="London"
      intro="I build dependable tools."
      primaryAction={{ label: "View work", href: "/work" }}
    />
    <ProjectIndex projects={[{
      title: "Analytical engine",
      description: "A documented system design.",
      href: "/work/engine",
      year: "1843",
      tags: ["Systems"]
    }]} />
  </main>
)

if (!html.includes("Ada Lovelace") || !html.includes("Analytical engine")) {
  throw new Error("React 18 server rendering omitted registry block content")
}
`,
	},
	bundle: true,
	write: false,
	platform: "node",
	format: "cjs",
	target: "node18",
	alias: {
		react: react18Root,
		"react-dom": reactDom18Root,
	},
})

assert.ok(result.outputFiles[0]?.text.includes("Ada Lovelace"))

const tempDirectory = await mkdtemp(path.join(os.tmpdir(), "monoline-react18-"))
const bundlePath = path.join(tempDirectory, "compatibility-test.cjs")

try {
	await writeFile(bundlePath, result.outputFiles[0].text)
	await import(`${pathToFileURL(bundlePath).href}?t=${Date.now()}`)
	console.log("React 18 rendered the first registry blocks successfully")
} finally {
	await rm(tempDirectory, { recursive: true, force: true })
}
