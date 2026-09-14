// @vitest-environment node
import { load } from "js-yaml"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { expect, it } from "vitest"

const template = (name: string) =>
	readFile(join(import.meta.dirname, "../templates", name), "utf8")

it("uses static Vercel output and disables preview indexing without SPA rewrites", async () => {
	const vercel = JSON.parse(await template("vercel.json"))
	expect(vercel.framework).toBeNull()
	expect(vercel.outputDirectory).toBe("dist")
	expect(vercel.installCommand).toContain("--frozen-lockfile")
	expect(vercel.buildCommand).toContain('"$VERCEL_ENV" = "production"')
	expect(vercel.buildCommand).toContain("pnpm build --indexing false")
	expect(vercel.trailingSlash).toBe(true)
	expect(vercel.rewrites).toBeUndefined()
})

it("keeps Netlify previews on the production build path with indexing disabled", async () => {
	const netlify = await template("netlify.toml")
	expect(netlify).toMatch(
		/\[build\]\s*command = "pnpm build"\s*publish = "dist"/
	)
	for (const context of ["deploy-preview", "branch-deploy"])
		expect(netlify).toContain(
			`[context.${context}]\ncommand = "pnpm build --indexing false"`
		)
	expect(netlify).toContain('PNPM_FLAGS = "--frozen-lockfile"')
	expect(netlify).not.toContain("[[redirects]]")
})

it("pins Pages actions and deploys only a successful build with limited permissions", async () => {
	const pages = load(await template("github-pages.yml")) as {
		permissions: object
		jobs: Record<
			string,
			{
				needs?: string
				if?: string
				permissions: object
				steps: Array<{
					uses?: string
					run?: string
					with?: Record<string, string>
				}>
			}
		>
	}
	expect(pages.permissions).toEqual({})
	expect(pages.jobs.deploy!.needs).toBe("build")
	expect(pages.jobs.deploy!.if).toBe("github.ref == 'refs/heads/main'")
	expect(pages.jobs.deploy!.permissions).toEqual({
		pages: "write",
		"id-token": "write",
	})
	expect(pages.jobs.build!.permissions).toEqual({
		contents: "read",
		pages: "read",
	})
	for (const job of Object.values(pages.jobs))
		for (const step of job.steps) {
			if (step.uses) expect(step.uses).toMatch(/@[a-f0-9]{40}$/)
		}
	const steps = pages.jobs.build!.steps
	expect(
		steps.find((step) => step.uses?.startsWith("actions/checkout@"))?.with?.[
			"persist-credentials"
		]
	).toBe(false)
	const build = steps.findIndex((step) => step.run?.includes("--site"))
	const upload = steps.findIndex((step) =>
		step.uses?.startsWith("actions/upload-pages-artifact@")
	)
	expect(upload).toBeGreaterThan(build)
	expect(steps[build]!.run).toContain('--base "${DOCS_BASE_PATH%/}/"')
	expect(steps[upload]!.with?.path).toBe("dist")
})
