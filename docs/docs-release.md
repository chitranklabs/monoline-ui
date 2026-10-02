# Docs release and recovery

## Release state

Docs releases independently from Monoline UI. The current Docs manifest is
`0.0.0`; the existing minor Changeset plans `0.1.0`. Release preparation must
derive the version from the repository's actual Changesets state, not this note.
An October 2, 2026 public npm lookup returned 404; it does not prove private
package availability. No publication or deployment was performed.

The prepare workflow opens a Docs-only version PR. Finalization runs after the
approved PR merges, verifies its release intent and publishes an immutable
`docs-v<version>` tag and npm artifact. Mixed UI/Docs version intents are rejected.
The user owns commits, PRs and explicit publication authorization.

## Verification and provenance

Run the existing package build, packed-consumer fixture, browser checks and
release-script tests before approving the release. The packed fixture checks
public imports, declarations, CLI and Astro/React consumers without ancestor
dependency resolution. npm is the initial target; a JSR dry-run probe rejects
public `.astro` exports.

The npm workflow requests provenance and requires its configured registry
credentials and permissions. Local tests do not establish that production OIDC,
registry authorization or provenance attestation is configured correctly. Verify
the published artifact and attestation before declaring release complete. See
[npm provenance](https://docs.npmjs.com/generating-provenance-statements/) and
[trusted publishing](https://docs.npmjs.com/trusted-publishers/).

## Failure recovery

Use the finalize workflow's manual dispatch with the exact stable tag, for
example `docs-v0.1.0`. Manual recovery checks out that immutable tag rather than
current main. Malformed tags are rejected before checkout.

If an npm upload succeeds but the client reports an error, finalization polls
registry metadata and compares the downloaded tarball with the candidate. A
matching artifact is accepted without another upload; mismatched contents fail.
Persistent absence retains the upload error. Fix credentials or infrastructure
before retrying; never overwrite or silently accept a different artifact.

After any failed run, inspect the tag, npm metadata, tarball identity and GitHub
release independently. Recovery may complete missing steps but must not rebuild
an old release from a newer branch. Never log registry credentials.

## Rollback and external gates

Published npm versions are immutable. Prefer a new corrective release; for an
existing previous known-good version, a separately authorized operator may move
the `latest` dist-tag back after verifying compatibility. Do not unpublish as an
automatic rollback. Site rollback uses the hosting provider's prior deployment;
local builds preserve last-good output on build failure.

Before publication, approve screenshots in both themes/densities, complete
manual screen-reader review, verify real root/subpath hosting, confirm package
ownership and credentials, and explicitly authorize the planned version. Local
workflow tests and dry runs cannot substitute for these external checks.
