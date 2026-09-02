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
import { Button } from "./src/components/button"
import { Card } from "./src/components/card"
import { Toggle } from "./src/components/toggle"

if (!React.version.startsWith("18.")) throw new Error(\`Expected React 18, received \${React.version}\`)

const html = renderToString(
  <main>
    <Card>
      <Button>View work</Button>
      <Toggle aria-label="Pin project">Pin project</Toggle>
    </Card>
  </main>
)

if (!html.includes("View work") || !html.includes("Pin project")) {
	throw new Error("React 18 server rendering omitted component content")
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

assert.ok(result.outputFiles[0]?.text.includes("View work"))

const tempDirectory = await mkdtemp(path.join(os.tmpdir(), "monoline-react18-"))
const bundlePath = path.join(tempDirectory, "compatibility-test.cjs")

try {
	await writeFile(bundlePath, result.outputFiles[0].text)
	await import(`${pathToFileURL(bundlePath).href}?t=${Date.now()}`)
	console.log(
		"React 18 rendered static and interactive components successfully"
	)
} finally {
	await rm(tempDirectory, { recursive: true, force: true })
}
