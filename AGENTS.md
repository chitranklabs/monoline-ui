# Monoline — Agent and Developer Guidelines

## Working scope

- Inspect the current branch and working tree before changes. Preserve unrelated edits.
- Monoline Docs priorities follow [package roadmap](packages/docs/ROADMAP.md). Keep it focused on remaining work; do not create persistent audit ledgers or completed-work plans.
- Read the relevant local specs, operational guides and official documentation before implementation. Record verification and source/version assumptions in review notes rather than adding audit reports.
- Follow [packages/docs/AGENTS.md](packages/docs/AGENTS.md) for the Docs package, demo and related build/consumer work.
- Keep changes in the current branch unless the user requests another branch.
- The user handles commits and PRs. Provide materials; do not commit, push, create PRs, publish or deploy without authorization.
- Keep temporary batch/milestone numbers in plans and PR descriptions, never source comments or test headers.

## Efficient discovery

- Reuse existing commands and dependencies. Avoid adding scripts for simple commands, speculative helpers or repeated test setup.
- Run checks relevant to the change; broaden only when failures or unresolved concerns justify it.
