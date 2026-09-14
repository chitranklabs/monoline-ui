import { readFile, writeFile } from "node:fs/promises"

const source = await readFile(
	new URL("../ui/src/foundations/theme/tokens.css", import.meta.url),
	"utf8"
)
const names = [
	"background",
	"foreground",
	"muted-foreground",
	"border",
	"surface",
	"accent",
	"destructive",
	"callout-info-accent",
	"callout-tip-accent",
	"callout-warn-accent",
	"code-comment",
	"code-keyword",
	"code-ident",
	"code-string",
	"code-number",
]
const themes = ["light", "dark"].map((theme) => {
	const block = source.match(
		new RegExp(`\\[data-theme="${theme}"\\]\\s*\\{([^}]+)\\}`)
	)?.[1]
	if (!block) throw new Error(`Missing UI ${theme} token block`)
	return names.map((name) => {
		const values = [
			...block.matchAll(new RegExp(`--${name}:\\s*([^;]+);`, "g")),
		]
		if (values.length !== 1)
			throw new Error(`Expected one ${theme} ${name} token`)
		return values[0][1]
	})
})
const target = new URL("./src/theme-tokens.css", import.meta.url)
const output = `/* Generated from Monoline UI tokens by sync-tokens.mjs. */\n:root {\n${names.map((name, index) => `\t--${name}: light-dark(${themes[0][index]}, ${themes[1][index]});`).join("\n")}\n}\n`
if (process.argv.includes("--check")) {
	if ((await readFile(target, "utf8")) !== output)
		throw new Error(
			"Docs tokens drifted; run node packages/docs/sync-tokens.mjs"
		)
} else {
	await writeFile(target, output)
}
