import assert from "node:assert/strict"
import { execFile } from "node:child_process"
import {
	cp,
	mkdir,
	mkdtemp,
	readFile,
	rm,
	symlink,
	writeFile,
} from "node:fs/promises"
import path from "node:path"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)
const projectRoot = path.resolve(import.meta.dirname, "../..")
const registry = JSON.parse(
	await readFile(path.join(projectRoot, "registry.json"), "utf8")
)
const proofNames = ["profile-hero-01", "project-index-01"]
const consumerDir = await mkdtemp(
	path.join(projectRoot, ".tmp-registry-consumer-")
)

try {
	const blockDir = path.join(consumerDir, "components", "monoline")
	const packageScope = path.join(consumerDir, "node_modules", "@chitrank2050")
	await mkdir(path.join(consumerDir, "app"), { recursive: true })
	await mkdir(blockDir, { recursive: true })
	await mkdir(packageScope, { recursive: true })
	await symlink(
		path.join(projectRoot, "dist"),
		path.join(packageScope, "monoline-ui"),
		"dir"
	)

	for (const name of proofNames) {
		const item = registry.items.find((candidate) => candidate.name === name)
		assert.ok(item, `Missing registry proof ${name}`)
		const file = item.files[0]
		await cp(
			path.join(projectRoot, file.path),
			path.join(blockDir, `${name}.tsx`)
		)
	}

	await writeFile(
		path.join(consumerDir, "package.json"),
		JSON.stringify({ private: true, type: "module" })
	)
	await writeFile(
		path.join(consumerDir, "app", "layout.tsx"),
		`import "@chitrank2050/monoline-ui/theme.css"
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
`
	)
	await writeFile(
		path.join(consumerDir, "app", "page.tsx"),
		`import { ProfileHero } from "../components/monoline/profile-hero-01"
import { ProjectIndex } from "../components/monoline/project-index-01"

export default function Page() {
  return <main>
    <ProfileHero name="Clean consumer" jobTitle="Engineer" location="Remote" intro="Registry proof." primaryAction={{ label: "Work", href: "#work" }} />
    <ProjectIndex projects={[{ title: "Proof", description: "Installed source.", href: "#proof", year: "2026", tags: ["React"] }]} />
  </main>
}
`
	)

	await execFileAsync(
		path.join(projectRoot, "node_modules", ".bin", "next"),
		["build"],
		{
			cwd: consumerDir,
			env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
		}
	)
	console.log("Clean consumer built profile-hero-01 and project-index-01")
} finally {
	await rm(consumerDir, { recursive: true, force: true })
}
