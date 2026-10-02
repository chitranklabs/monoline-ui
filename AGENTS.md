# Monoline — Agent and Developer Guidelines

## Working scope

- Inspect the current branch and working tree before changes. Preserve unrelated edits.
- Monoline Docs work follows [PLAN.md](PLAN.md). Update its status with verification evidence.
- Every new or revised plan must include required-reading links to relevant local specs, audits and official documentation, mapped to its milestones. Agents must read the applicable references before implementation and record source/version assumptions; a list of links alone is not evidence of review.
- Follow [packages/docs/AGENTS.md](packages/docs/AGENTS.md) for the Docs package, demo and related build/consumer work.
- Keep changes in the current branch unless the user requests another branch.
- The user handles commits and PRs. Provide materials; do not commit, push, create PRs, publish or deploy without authorization.
- Keep temporary batch/milestone numbers in plans and PR descriptions, never source comments or test headers.

## Efficient discovery

- Reuse existing commands and dependencies. Avoid adding scripts for simple commands, speculative helpers or repeated test setup.
- Run checks relevant to the change; broaden only when failures or unresolved concerns justify it.
