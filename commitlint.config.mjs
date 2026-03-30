/**
 * Commitlint Configuration — Enforces Conventional Commits format.
 *
 * Every commit message must follow: type(scope?): description
 *
 * Valid types:
 *   feat     — New feature (correlates with MINOR in semver)
 *   fix      — Bug fix (correlates with PATCH in semver)
 *   docs     — Documentation only
 *   style    — Formatting, missing semicolons (no code change)
 *   refactor — Code change that neither fixes a bug nor adds a feature
 *   perf     — Performance improvement
 *   test     — Adding or fixing tests
 *   build    — Build system or external dependencies (npm, docker)
 *   ci       — CI configuration (GitHub Actions, etc.)
 *   chore    — Maintenance tasks (updating deps, configs)
 *   revert   — Reverting a previous commit
 *
 * Examples:
 *   feat: add tenant CRUD endpoints
 *   fix: resolve correlation ID missing on 500 errors
 *   docs: add Phase 0 build log
 *   refactor(prisma): extract connection config to adapter
 *   build(docker): add Redis container to compose
 */
export default {
	extends: ["@commitlint/config-conventional"],
}
